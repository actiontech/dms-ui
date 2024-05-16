import { Form } from 'antd';
import { BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { PolicyFormType } from '../../index.type';

const PolicyForm: React.FC<{
  form: PolicyFormType;
  disablePassword?: boolean;
}> = ({ form, disablePassword = false }) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('passwordSecurityPolicy.policy.modal.name')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('passwordSecurityPolicy.policy.modal.name')
          })}
          disabled={disablePassword}
        />
      </Form.Item>

      <Form.Item
        name="passwordExpirationPeriod"
        label={t('passwordSecurityPolicy.policy.modal.periodOfValidity')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('passwordSecurityPolicy.policy.modal.periodOfValidity')
          })}
        />
      </Form.Item>
    </Form>
  );
};

export default PolicyForm;
