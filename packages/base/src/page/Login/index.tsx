import { Form, message, Typography, Space, Checkbox } from 'antd';
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
import {
  DMS_REDIRECT_KEY_PARAMS_NAME,
  OPEN_CLOUD_BEAVER_URL_PARAM_NAME
} from '@actiontech/shared/lib/data/common';
import { useLocation, useNavigate } from 'react-router-dom';
// import useBrowserVersionTips from './hooks/useBrowserVersionTips';

// #if [ee]
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  CompanyNoticeDisplayStatusEnum
} from '@actiontech/shared/lib/enum';
// #endif

const Login = () => {
  const { t } = useTranslation();

  // useBrowserVersionTips();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [loading, { setTrue, setFalse }] = useBoolean();

  const navigate = useNavigate();
  const location = useLocation();
  const login = (formData: LoginFormFieldValue) => {
    // #if [ee]
    if (!formData.userAgreement) {
      messageApi.error(t('dmsLogin.errorMessage.userAgreement'));
      return;
    }
    // #endif
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
          const params = new URLSearchParams(location.search);
          const target = params.get(DMS_REDIRECT_KEY_PARAMS_NAME);
          if (target) {
            if (target === '/cloudBeaver') {
              navigate(`/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`);
            } else {
              navigate(target);
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

  const { run: getOauth2Tips, data: oauthConfig } = useRequest(
    () => {
      return dms.GetOauth2Tips().then((res) => res.data?.data ?? {});
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
    </LoginLayout>
  );
};
export default Login;
