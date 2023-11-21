import { Form } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../store/user';
import LoginLayout from './components/LoginLayout';
import { BasicInput, BasicButton } from '@actiontech/shared';
import { IconCommonUser, IconCommonPassword } from '../../icon';
import { LoginFormFieldValue } from './types';
import { useBoolean } from 'ahooks';
import auth from '@actiontech/shared/lib/api/diagnosis/service/auth';

const Login = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [loading, { setTrue, setFalse }] = useBoolean();

  const login = (formData: LoginFormFieldValue) => {
    setTrue();
    auth
      .V1Login({
        username: formData.username,
        password: formData.password
      })
      .then((res) => {
        // todo: 待后端修改后添加token逻辑
        // const token = res.data.data?.token
        //   ? `Bearer ${res.data.data.token}`
        //   : '';
        // if (token) {
        //   dispatch(
        //     updateToken({
        //       token
        //     })
        //   );
        // }
      })
      .finally(() => {
        setFalse();
      });
  };

  return (
    <LoginLayout>
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
        {/* <Form.Item name="userAgreement" valuePropName="checked">
          <Checkbox>
            <Space>
              {t('dmsLogin.userAgreementTips')}
              <Typography.Link href="/user-agreement.html" target="_blank">
                {t('dmsLogin.userAgreement')}
              </Typography.Link>
            </Space>
          </Checkbox>
        </Form.Item> */}
        <BasicButton
          type="primary"
          className="login-btn"
          htmlType="submit"
          loading={loading}
        >
          {t('login.login')}
        </BasicButton>
      </Form>
    </LoginLayout>
  );
};
export default Login;
