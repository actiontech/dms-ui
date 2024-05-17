import { Form } from 'antd';
import { BasicSelect, BasicInputNumber } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import useSecurityPolicy, {
  normalPolicyValue
} from '../../../../hooks/useSecurityPolicy';
import { useEffect } from 'react';

const PasswordPolicyField: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance();

  const policy = Form.useWatch('policy', form);

  const { updateSecurityPolicyList, policyOptions, policyList } =
    useSecurityPolicy();

  useEffect(() => {
    if (visible) {
      updateSecurityPolicyList();
    }
  }, [updateSecurityPolicyList, visible]);

  useEffect(() => {
    if (policy !== normalPolicyValue) {
      const value = policyList.find(
        (i) => i.uid === policy
      )?.password_expiration_period;
      form.setFieldValue('effective_time_day', value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy]);

  return (
    <>
      <Form.Item
        name="policy"
        label={t('databaseAccount.create.form.policy')}
        rules={[{ required: true }]}
      >
        <BasicSelect options={policyOptions()} />
      </Form.Item>
      <Form.Item
        name="effective_time_day"
        label={t('databaseAccount.create.form.effectiveTimeDay')}
        rules={[{ required: true }]}
      >
        <BasicInputNumber
          disabled={policy !== undefined && policy !== normalPolicyValue}
          min={0}
        />
      </Form.Item>
    </>
  );
};

export default PasswordPolicyField;
