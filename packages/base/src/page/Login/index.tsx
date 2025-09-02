import { message, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  updateIsFirstLogin,
  updatePasswordSecurity,
  updateToken
} from '../../store/user';
import LoginLayout from './components/LoginLayout';
import { useTypedNavigate, useTypedQuery, EmptyBox } from '@actiontech/shared';
import { LoginFormFieldValue, VerificationCodeFormFieldValue } from './types';
import { useBoolean } from 'ahooks';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum,
  ResponseCode
} from '@actiontech/shared/lib/enum';
import {
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME,
  ROUTE_PATHS
} from '@actiontech/shared/lib/data/routePaths';
import LoginForm from './components/LoginForm';
import VerificationCodeForm from './components/VerificationCodeForm';
import { UserService, SessionService } from '@actiontech/shared/lib/api';
import { useState } from 'react';

const INITIAL_USERNAME = 'admin';
const INITIAL_PASSWORD = 'admin';

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

  const addSession = () => {
    const loginFormValues = loginForm.getFieldsValue();
    const verificationCodeFormValues = verificationCodeForm.getFieldsValue();
    SessionService.AddSession({
      session: {
        username: loginFormValues.username,
        password: loginFormValues.password,
        // #if [ee]
        verify_code: verificationCodeFormValues.verificationCode
        // #endif
      }
    })
      .then((res) => {
        if (
          loginFormValues.username === INITIAL_USERNAME &&
          loginFormValues.password === INITIAL_PASSWORD
        ) {
          dispatch(updateIsFirstLogin(true));
        }
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
          }
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
    UserService.VerifyUserLogin({
      session: {
        username: formData.username,
        password: formData.password
      }
    })
      .then((res) => {
        const { code, data } = res.data;
        if (code === ResponseCode.SUCCESS) {
          dispatch(
            updatePasswordSecurity({
              passwordSecurity: {
                passwordExpired: data?.password_expired ?? false,
                passwordExpiryDays: data?.password_expiry_days ?? 0
              }
            })
          );
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
  // #endif

  return (
    <LoginLayout>
      {contextHolder}
      <LoginForm
        hidden={allowVerificationCode}
        form={loginForm}
        onSubmit={login}
        loading={loading}
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
    </LoginLayout>
  );
};
export default Login;
