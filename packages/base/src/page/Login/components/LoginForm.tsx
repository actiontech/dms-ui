import { Form, Typography, Space, Checkbox } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { BasicInput, BasicButton, BasicToolTip } from '@actiontech/shared';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { LoginFormProps } from '../types';
import {
  ConfigurationService,
  OAuth2Service
} from '@actiontech/shared/lib/api';
import { SystemRole } from '@actiontech/shared/lib/enum';

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  form,
  hidden
}) => {
  const { t } = useTranslation();

  const username = Form.useWatch('username', form);

  const { baseTheme } = useThemeStyleData();

  const { run: getOauth2Tips, data: oauthConfig } = useRequest(
    () => {
      return OAuth2Service.GetOauth2Tips().then((res) => res.data?.data ?? {});
    },
    {
      manual: true
    }
  );

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
    getOauth2Tips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endif

  return (
    <Form
      onFinish={onSubmit}
      initialValues={{
        userAgreement: true
      }}
      form={form}
      hidden={hidden}
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
      {oauthConfig?.enable_oauth2 ? (
        <BasicButton className="other-login-btn" href="/v1/dms/oauth2/link">
          {oauthConfig?.login_tip}
        </BasicButton>
      ) : null}
    </Form>
  );
};

export default LoginForm;
