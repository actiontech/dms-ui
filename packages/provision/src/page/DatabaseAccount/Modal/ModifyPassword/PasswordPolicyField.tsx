import { Form, Radio } from 'antd';
import {
  BasicSelect,
  BasicInputNumber,
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import useSecurityPolicy, {
  NORMAL_POLICY_VALUE
} from '../../../../hooks/useSecurityPolicy';
import { useEffect } from 'react';
import { passwordExpirationPolicyOptions } from '../../Create/BaseInfoForm/index.data';
import { ModifyPasswordFormType } from '../../index.type';
import { PasswordConfigPasswordExpirationPolicyEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

const PasswordPolicyField: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { t } = useTranslation();

  const form =
    Form.useFormInstance<
      Pick<
        ModifyPasswordFormType,
        'policy' | 'effective_time_day' | 'password_expiration_policy'
      >
    >();

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
      <FormItemLabel
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.passwordExpirationPolicy')}
            tips={t('databaseAccount.create.form.passwordExpirationPolicyTips')}
          />
        }
        name="password_expiration_policy"
        initialValue={
          PasswordConfigPasswordExpirationPolicyEnum.expiration_lock
        }
        className="has-label-tip"
      >
        <Radio.Group options={passwordExpirationPolicyOptions} />
      </FormItemLabel>
    </>
  );
};

export default PasswordPolicyField;
