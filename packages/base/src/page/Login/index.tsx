import { message, Form, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateToken, updateIsLoggingIn } from '../../store/user';
import LoginLayout from './components/LoginLayout';
import { EmptyBox } from '@actiontech/dms-kit';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
import { LoginFormFieldValue, VerificationCodeFormFieldValue } from './types';
import { useBoolean, useRequest } from 'ahooks';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LocalStorageWrapper } from '@actiontech/dms-kit';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum,
  ResponseCode
} from '@actiontech/dms-kit';
import {
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME,
  ROUTE_PATHS
} from '@actiontech/dms-kit';
import LoginForm from './components/LoginForm';
import VerificationCodeForm from './components/VerificationCodeForm';
import OAuth2LoginForm from './components/OAuth2LoginForm';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useState, useMemo, useEffect } from 'react';
import useSessionUser from '../../hooks/useSessionUser';
import useNavigateToWorkbench from '../../hooks/useNavigateToWorkbench';

const Login = () => {
  const { t } = useTranslation();
  useBrowserVersionTips();
  const [loginForm] = Form.useForm<LoginFormFieldValue>();
  const username = Form.useWatch('username', loginForm);
  const [verificationCodeForm] = Form.useForm<VerificationCodeFormFieldValue>();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, { setTrue, setFalse }] = useBoolean();
  const [phone, setPhone] = useState<string>();
  const [
    verifyCodeLoading,
    { setTrue: verifyCodePending, setFalse: verifyCodeDone }
  ] = useBoolean();
  const [
    allowVerificationCode,
    { setTrue: showVerificationForm, setFalse: hideVerificationForm }
  ] = useBoolean();
  const navigate = useTypedNavigate();
  const extractQueries = useTypedQuery();

  const { getSessionUserInfoAsync, getSessionUserSystemLoading } =
    useSessionUser();

  const {
    navigateToWorkbenchAsync,
    getAvailabilityZoneTipsAsync,
    navigateToWorkbenchLoading,
    getAvailabilityZoneTipsLoading
  } = useNavigateToWorkbench();

  const { data: oauthConfig, run: getOauth2Tips } = useRequest(
    () => {
      return DmsApi.OAuth2Service.GetOauth2Tips().then(
        (res) => res.data?.data ?? {}
      );
    },
    {
      manual: true
    }
  );

  const isOAuth2Enabled = useMemo(() => {
    return !!oauthConfig?.enable_oauth2;
  }, [oauthConfig]);

  const [activeTab, setActiveTab] = useState<string>('oauth2');

  const addSession = () => {
    const loginFormValues = loginForm.getFieldsValue();
    const verificationCodeFormValues = verificationCodeForm.getFieldsValue();
    dispatch(updateIsLoggingIn(true));
    DmsApi.SessionService.AddSession({
      session: {
        username: loginFormValues.username,
        password: loginFormValues.password,
        // #if [ee]
        verify_code: verificationCodeFormValues.verificationCode
        // #endif
      }
    })
      .then((res) => {
        const token = res.data.data?.token
          ? `Bearer ${res.data.data.token}`
          : '';
        if (res.data.data?.message) {
          messageApi.error(res.data.data.message);
        }
        if (token) {
          dispatch(
            updateToken({
              token
            })
          );
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
              const encodedTarget = extractQueries(
                ROUTE_PATHS.BASE.LOGIN.index
              )?.target;
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
        }
        // #if [ee]
        LocalStorageWrapper.set(
          StorageKey.SHOW_COMPANY_NOTICE,
          CompanyNoticeDisplayStatusEnum.NotDisplayed
        );
        // #endif
      })
      .finally(() => {
        setFalse();
        verifyCodeDone();
      });
  };
  const login = (formData: LoginFormFieldValue) => {
    // #if [ee]
    if (!formData.userAgreement) {
      messageApi.error(t('dmsLogin.errorMessage.userAgreement'));
      return;
    }
    // #endif
    setTrue();
    // #if [ee]
    DmsApi.UserService.VerifyUserLogin({
      session: {
        username: formData.username,
        password: formData.password
      }
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === ResponseCode.SUCCESS) {
          if (data?.two_factor_enabled) {
            showVerificationForm();
            setPhone(data.phone);
            setFalse();
          } else {
            addSession();
          }
        }
      })
      .catch(() => {
        setFalse();
      });
    // #else
    addSession();
    // #endif
  };

  // #if [ee]
  const onVerify = () => {
    verifyCodePending();
    addSession();
  };

  useEffect(() => {
    getOauth2Tips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endif

  const LoginFormWrapper = () => {
    return (
      <>
        <LoginForm
          hidden={allowVerificationCode}
          form={loginForm}
          onSubmit={login}
          loading={
            loading ||
            getSessionUserSystemLoading ||
            getAvailabilityZoneTipsLoading ||
            navigateToWorkbenchLoading
          }
        />
        {/* #if [ee] */}
        <EmptyBox if={allowVerificationCode}>
          <VerificationCodeForm
            form={verificationCodeForm}
            loading={verifyCodeLoading}
            onVerify={onVerify}
            hideVerificationForm={hideVerificationForm}
            username={username}
            phone={phone}
          />
        </EmptyBox>
        {/* #endif */}
      </>
    );
  };

  return (
    <LoginLayout>
      {contextHolder}
      <EmptyBox if={isOAuth2Enabled} defaultNode={LoginFormWrapper()}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="login-tabs"
          items={[
            {
              key: 'oauth2',
              label: t('dmsLogin.thirdPartyLogin'),
              children: <OAuth2LoginForm loginTip={oauthConfig?.login_tip} />
            },
            {
              key: 'local',
              label: t('dmsLogin.localLogin'),
              children: LoginFormWrapper()
            }
          ]}
        />
      </EmptyBox>
    </LoginLayout>
  );
};
export default Login;
