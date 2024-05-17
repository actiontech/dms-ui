import { Form } from 'antd';
import { BasicSelect, BasicInputNumber } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import useSecurityPolicy, {
  NORMAL_POLICY_VALUE
} from '../../../../hooks/useSecurityPolicy';
import { useEffect } from 'react';

const PasswordPolicyField: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<{
    policy: string;
    effective_time_day: number;
  }>();

  const policy = Form.useWatch('policy', form);

  const {
    updateSecurityPolicyList,
    securityPolicyOptions,
    securityPolicyList
  } = useSecurityPolicy();

  useEffect(() => {
    if (visible) {
      updateSecurityPolicyList();
    }
  }, [updateSecurityPolicyList, visible]);

  useEffect(() => {
    if (policy !== NORMAL_POLICY_VALUE) {
      const value = securityPolicyList.find(
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
        <BasicSelect options={securityPolicyOptions()} />
      </Form.Item>
      <Form.Item
        name="effective_time_day"
        label={t('databaseAccount.create.form.effectiveTimeDay')}
        rules={[{ required: true }]}
      >
        <BasicInputNumber
          disabled={policy !== undefined && policy !== NORMAL_POLICY_VALUE}
          min={0}
        />
      </Form.Item>
    </>
  );
};

export default PasswordPolicyField;
