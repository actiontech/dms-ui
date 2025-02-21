import { Form, Typography, Space, Checkbox } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import OAuth2 from '@actiontech/shared/lib/api/base/service/OAuth2';
import { BasicInput, BasicButton } from '@actiontech/shared';
import { LockFilled, UserFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { LoginFormProps } from '../types';

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  form,
  hidden
}) => {
  const { t } = useTranslation();

  const { baseTheme } = useThemeStyleData();

  const { run: getOauth2Tips, data: oauthConfig } = useRequest(
    () => {
      return OAuth2.GetOauth2Tips().then((res) => res.data?.data ?? {});
    },
    {
      manual: true
    }
  );

  // #if [ee]
  useEffect(() => {
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
      <BasicButton
        type="primary"
        className="login-btn"
        htmlType="submit"
        loading={loading}
      >
        {t('dmsLogin.login')}
      </BasicButton>
      {oauthConfig?.enable_oauth2 ? (
        <BasicButton className="other-login-btn" href="/v1/dms/oauth2/link">
          {oauthConfig?.login_tip}
        </BasicButton>
      ) : null}
    </Form>
  );
};

export default LoginForm;
