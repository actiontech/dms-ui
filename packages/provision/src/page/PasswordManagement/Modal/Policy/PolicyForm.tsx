import { Form } from 'antd';
import { BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { PolicyFormType } from '../../index.type';

const PolicyForm: React.FC<{ form: PolicyFormType; disabled?: boolean }> = ({
  form,
  disabled = false
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('password.policy.modal.name')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('password.policy.modal.name')
          })}
          disabled={disabled}
        />
      </Form.Item>

      <Form.Item
        name="passwordExpirationPeriod"
        label={t('password.policy.modal.periodOfValidity')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('password.policy.modal.periodOfValidity')
          })}
        />
      </Form.Item>
    </Form>
  );
};

export default PolicyForm;
