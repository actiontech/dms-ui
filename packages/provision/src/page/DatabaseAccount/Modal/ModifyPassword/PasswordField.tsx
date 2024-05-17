import { Form } from 'antd';
import InputPassword from '../../../../components/PasswordWithGenerate';
import Password from '../../../../utils/Password';
import { BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ModifyPasswordFormType } from '../../index.type';

const PasswordField = () => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<ModifyPasswordFormType>();

  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      password,
      confirm_password: password
    });
    return password;
  };

  return (
    <>
      <Form.Item
        name="password"
        label={t('databaseAccount.create.form.password')}
        rules={[{ required: true }]}
      >
        <InputPassword clickGeneratePassword={generatePassword} />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label={t('databaseAccount.create.form.confirm_password')}
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('databaseAccount.create.form.password_error'))
              );
            }
          })
        ]}
      >
        <BasicInput.Password />
      </Form.Item>
    </>
  );
};

export default PasswordField;
