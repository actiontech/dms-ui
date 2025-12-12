import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  startTransition
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography, Form } from 'antd';
import { OauthLoginFormFields } from './index.type';
import { updateToken, updateIsLoggingIn } from '../../store/user';
import { ResponseCode } from '@actiontech/dms-kit';
import OAuth2 from '@actiontech/shared/lib/api/base/service/OAuth2';
import LoginLayout from '../Login/components/LoginLayout';
import { BasicButton, BasicInput } from '@actiontech/dms-kit';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/dms-kit';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import {
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME,
  ROUTE_PATHS
} from '@actiontech/dms-kit';
import { LocalStorageWrapper } from '@actiontech/dms-kit';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum
} from '@actiontech/dms-kit';
import useSessionUser from '../../hooks/useSessionUser';
import useNavigateToWorkbench from '../../hooks/useNavigateToWorkbench';
const BindUser = () => {
  const navigate = useTypedNavigate();
  const { baseTheme } = useThemeStyleData();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const extractQueries = useTypedQuery();
  const urlParams = useMemo(() => {
    return extractQueries(ROUTE_PATHS.BASE.USER_BIND.index);
  }, [extractQueries]);
  useBrowserVersionTips();
  const loginLock = useRef(false);

  const { getSessionUserInfoAsync, getSessionUserSystemLoading } =
    useSessionUser();

  const {
    navigateToWorkbenchAsync,
    getAvailabilityZoneTipsAsync,
    navigateToWorkbenchLoading,
    getAvailabilityZoneTipsLoading
  } = useNavigateToWorkbench();

  const concatToken = (token = '') => {
    if (!token) {
      return '';
    }
    return `Bearer ${token}`;
  };

  const navigateToTarget = useCallback(() => {
    dispatch(updateIsLoggingIn(true));
    getSessionUserInfoAsync().then((shouldNavigateToWorkbench) => {
      if (shouldNavigateToWorkbench) {
        // #if [ee]
        getAvailabilityZoneTipsAsync().then(() => {
          navigateToWorkbenchAsync().then(() => {
            dispatch(updateIsLoggingIn(false));
          });
        });
        // #else
        navigateToWorkbenchAsync().then(() => {
          dispatch(updateIsLoggingIn(false));
        });
        // #endif
      } else {
        const encodedTarget = urlParams?.target;
        if (encodedTarget) {
          const decoded = decodeURIComponent(encodedTarget);
          const [path, targetParams] = decoded.split('?');
          if (targetParams) {
            navigate(`${path}?${targetParams}`);
          } else if (path.endsWith('cloud-beaver')) {
            navigate(`${path}?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`);
          } else {
            navigate(path);
          }
        } else {
          navigate(ROUTE_PATHS.BASE.HOME);
        }
        dispatch(updateIsLoggingIn(false));
      }
    });
  }, [
    dispatch,
    getSessionUserInfoAsync,
    getAvailabilityZoneTipsAsync,
    navigateToWorkbenchAsync,
    urlParams,
    navigate
  ]);
  const login = (values: OauthLoginFormFields) => {
    const oauth2Token = urlParams?.oauth2_token;
    loginLock.current = true;
    if (!oauth2Token) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: t('dmsLogin.oauth.lostOauth2Token'),
        duration: 0
      });
      loginLock.current = false;
      // 使用startTransition的原因如下：
      // login 函数是表单的 onFinish 回调，属于同步用户交互事件
      // navigate 可能会触发懒加载组件（Suspense）
      // React 18 不允许在同步事件中直接触发 Suspense，否则会抛出错误
      startTransition(() => {
        navigate(ROUTE_PATHS.BASE.LOGIN.index.path);
      });
      return;
    }
    OAuth2.BindOauth2User({
      oauth2_token: oauth2Token,
      refresh_token: urlParams?.refresh_token,
      user_name: values.username,
      pwd: values.password
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(
            updateToken({
              token: concatToken(res.data.data?.token)
            })
          );
          navigateToTarget();
          // #if [ee]
          LocalStorageWrapper.set(
            StorageKey.SHOW_COMPANY_NOTICE,
            CompanyNoticeDisplayStatusEnum.NotDisplayed
          );
          // #endif
        }
      })
      .finally(() => {
        loginLock.current = false;
      });
  };
  useEffect(() => {
    const error = urlParams?.error;
    if (error) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: error,
        duration: 0
      });
      navigate(ROUTE_PATHS.BASE.LOGIN.index.path);
      return;
    }
    const userExist = urlParams?.user_exist === 'true';
    if (!userExist) return;
    const token = urlParams?.dms_token;
    if (!token) {
      eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
        message: t('dmsLogin.oauth.errorTitle'),
        description: t('dmsLogin.oauth.lostToken'),
        duration: 0
      });
      navigate(ROUTE_PATHS.BASE.LOGIN.index.path);
      return;
    }
    dispatch(
      updateToken({
        token: concatToken(token)
      })
    );
    navigateToTarget();
  }, [
    dispatch,
    navigate,
    navigateToTarget,
    t,
    urlParams?.dms_token,
    urlParams?.error,
    urlParams?.user_exist
  ]);
  const isLoading =
    loginLock.current ||
    getSessionUserSystemLoading ||
    getAvailabilityZoneTipsLoading ||
    navigateToWorkbenchLoading;

  return (
    <LoginLayout>
      <Form onFinish={login} disabled={isLoading}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsLogin.oauth.form.username', {
                  title: DMS_DEFAULT_WEB_TITLE
                })
              })
            }
          ]}
        >
          <BasicInput
            placeholder={t('dmsLogin.oauth.form.username', {
              title: DMS_DEFAULT_WEB_TITLE
            })}
            autoFocus
            className="login-form-field"
            prefix={
              <UserFilled
                width="18"
                height="19"
                color={baseTheme.icon.bindUser.user}
              />
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('common.password')
              })
            }
          ]}
        >
          <BasicInput.Password
            placeholder={t('common.password')}
            className="login-form-field"
            prefix={
              <LockFilled
                width={18}
                height={18}
                color={baseTheme.icon.bindUser.password}
              />
            }
          />
        </Form.Item>
        <Typography.Text type="secondary">
          {t('dmsLogin.oauth.bindTips')}
        </Typography.Text>
        <BasicButton
          type="primary"
          block
          htmlType="submit"
          className="login-btn"
          loading={isLoading}
        >
          {t('dmsLogin.oauth.submitButton')}
        </BasicButton>
      </Form>
    </LoginLayout>
  );
};
export default BindUser;
