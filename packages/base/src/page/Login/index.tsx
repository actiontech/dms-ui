import { Form, message, Typography, Space, Checkbox } from 'antd5';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';
import { updateToken } from '../../store/user';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import LoginLayout from './components/LoginLayout';
import { BasicInput, BasicButton } from '@actiontech/shared';
import { IconCommonUser, IconCommonPassword } from '../../icon/common';
import { LoginFormFieldValue } from './types';
import { useBoolean } from 'ahooks';
/* IFTRUE_isEE */
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum
} from '@actiontech/shared/lib/enum';
/* FITRUE_isEE */

const Login = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [loading, { setTrue, setFalse }] = useBoolean();

  const login = (formData: LoginFormFieldValue) => {
    /* IFTRUE_isEE */
    if (!formData.userAgreement) {
      messageApi.error(t('dmsLogin.errorMessage.userAgreement'));
      return;
    }
    /* FITRUE_isEE */
    setTrue();
    dms
      .AddSession({
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
        }
        /* IFTRUE_isEE */
        LocalStorageWrapper.set(
          StorageKey.SHOW_COMPANY_NOTICE,
          CompanyNoticeDisplayStatusEnum.NotDisplayed
        );
        /* FITRUE_isEE */
      })
      .finally(() => {
        setFalse();
      });
  };

  const { run: getOauth2Tips, data: oauthConfig } = useRequest(
    () => dms.GetOauth2Tips().then((res) => res.data?.data ?? {}),
    {
      manual: true
    }
  );

  // /* IFTRUE_isEE */
  useEffect(() => {
    getOauth2Tips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* FITRUE_isEE */
  return (
    <LoginLayout>
      {contextHolder}
      <Form
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
            prefix={<IconCommonUser />}
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
            prefix={<IconCommonPassword />}
          />
        </Form.Item>
        {/* IFTRUE_isEE */}
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
        {/* FITRUE_isEE */}
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
    </LoginLayout>
  );
};
export default Login;
