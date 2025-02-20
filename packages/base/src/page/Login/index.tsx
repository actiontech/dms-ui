import { Form, message, Typography, Space, Checkbox } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';
import { updateToken } from '../../store/user';
import Session from '@actiontech/shared/lib/api/base/service/Session';
import LoginLayout from './components/LoginLayout';
import {
  BasicInput,
  BasicButton,
  useTypedNavigate,
  useTypedQuery,
  BasicToolTip
} from '@actiontech/shared';
import { LoginFormFieldValue } from './types';
import { useBoolean } from 'ahooks';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum,
  SystemRole
} from '@actiontech/shared/lib/enum';
import {
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME,
  ROUTE_PATHS
} from '@actiontech/shared/lib/data/routePaths';
import { ConfigurationService } from '@actiontech/shared/lib/api';

const Login = () => {
  const { t } = useTranslation();

  const { baseTheme } = useThemeStyleData();
  const [form] = Form.useForm<LoginFormFieldValue>();

  const username = Form.useWatch('username', form);

  useBrowserVersionTips();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [loading, { setTrue, setFalse }] = useBoolean();

  const navigate = useTypedNavigate();
  const extractQueries = useTypedQuery();
  const login = (formData: LoginFormFieldValue) => {
    // #if [ee]
    if (!formData.userAgreement) {
      messageApi.error(t('dmsLogin.errorMessage.userAgreement'));
      return;
    }
    // #endif
    setTrue();
    Session.AddSession({
      session: {
        username: formData.username,
        password: formData.password
      }
    })
      .then((res) => {
        const token = res.data.data?.token
          ? `Bearer ${res.data.data.token}`
          : '';
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
      });
  };

  const { run: getLoginBasicConfig, data: loginBasicConfig } = useRequest(
    () => {
      return ConfigurationService.GetLoginTips().then(
        (res) => res.data?.data ?? {}
      );
    },
    {
      manual: true
    }
  );

  const renderLoginButton = () => {
    const disabledLoginButton =
      username === SystemRole.admin
        ? false
        : !!loginBasicConfig?.disable_user_pwd_login;

    const loginNode = (
      <BasicButton
        type="primary"
        className="login-btn"
        htmlType="submit"
        loading={loading}
        disabled={disabledLoginButton}
      >
        {loginBasicConfig?.login_button_text || t('dmsLogin.login')}
      </BasicButton>
    );
    if (disabledLoginButton) {
      return (
        <BasicToolTip
          className="login-btn-tooltip-wrapper"
          title={t('dmsLogin.loginButtonDisabledTips')}
        >
          {loginNode}
        </BasicToolTip>
      );
    }

    return loginNode;
  };

  // #if [ee]
  useEffect(() => {
    getLoginBasicConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endif

  return (
    <LoginLayout>
      {contextHolder}
      <Form
        form={form}
        onFinish={login}
        initialValues={{
          userAgreement: true
        }}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('common.username')
              })
            }
          ]}
        >
          <BasicInput
            className="login-form-field"
            placeholder={t('common.username')}
            autoFocus
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
            className="login-form-field"
            placeholder={t('common.password')}
            prefix={
              <LockFilled
                width={18}
                height={18}
                color={baseTheme.icon.bindUser.password}
              />
            }
          />
        </Form.Item>
        {/* #if [ee] */}
        <Form.Item name="userAgreement" valuePropName="checked">
          <Checkbox>
            <Space>
              {t('dmsLogin.userAgreementTips')}
              <Typography.Link href="/user-agreement.html" target="_blank">
                {t('dmsLogin.userAgreement')}
              </Typography.Link>
            </Space>
          </Checkbox>
        </Form.Item>
        {/* #endif */}

        {renderLoginButton()}

        {loginBasicConfig?.enable_oauth2 ? (
          <BasicButton className="other-login-btn" href="/v1/dms/oauth2/link">
            {loginBasicConfig?.oauth2_login_tip}
          </BasicButton>
        ) : null}
      </Form>
    </LoginLayout>
  );
};
export default Login;
