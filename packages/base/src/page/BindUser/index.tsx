import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography, Form } from 'antd';
import { OauthLoginFormFields } from './index.type';
import { updateToken } from '../../store/user';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import OAuth2 from '@actiontech/shared/lib/api/base/service/OAuth2';
import LoginLayout from '../Login/components/LoginLayout';
import {
  BasicButton,
  BasicInput,
  useTypedNavigate,
  useTypedQuery
} from '@actiontech/shared';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum
} from '@actiontech/shared/lib/enum';

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

  const concatToken = (token = '') => {
    if (!token) {
      return '';
    }
    return `Bearer ${token}`;
  };

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
      navigate(ROUTE_PATHS.BASE.LOGIN.index.path);
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
          dispatch(updateToken({ token: concatToken(res.data.data?.token) }));
          navigate(ROUTE_PATHS.BASE.HOME);
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
    dispatch(updateToken({ token: concatToken(token) }));
    navigate(ROUTE_PATHS.BASE.HOME);
  }, [
    dispatch,
    navigate,
    t,
    urlParams?.dms_token,
    urlParams?.error,
    urlParams?.user_exist
  ]);

  return (
    <LoginLayout>
      <Form onFinish={login} disabled={loginLock.current}>
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
          loading={loginLock.current}
        >
          {t('dmsLogin.oauth.submitButton')}
        </BasicButton>
      </Form>
    </LoginLayout>
  );
};

export default BindUser;
