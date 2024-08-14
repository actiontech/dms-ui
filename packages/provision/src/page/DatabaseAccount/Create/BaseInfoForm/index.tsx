import {
  FormItemLabel,
  FormItemSubTitle,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import {
  BasicInput,
  BasicSelect,
  BasicInputNumber,
  EmptyBox
} from '@actiontech/shared';
import InputPassword from '../../../../components/PasswordWithGenerate';
import Password from '../../../../utils/Password';
import { Form } from 'antd';
import useSecurityPolicy, {
  NORMAL_POLICY_VALUE
} from '../../../../hooks/useSecurityPolicy';
import { useEffect } from 'react';
import { CreateAccountFormType } from '../../index.type';

const BaseInfoForm: React.FC<{ disabled?: boolean }> = ({
  disabled = false
}) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<CreateAccountFormType>();

  const policy = Form.useWatch('policy', form);

  const {
    updateSecurityPolicyList,
    securityPolicyOptions,
    securityPolicyList
  } = useSecurityPolicy();

  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      password,
      confirm_password: password
    });
    return password;
  };

  useEffect(() => {
    if (policy !== NORMAL_POLICY_VALUE) {
      const value = securityPolicyList.find(
        (i) => i.uid === policy
      )?.password_expiration_period;
      form.setFieldValue('effective_time_day', value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy]);

  useEffect(() => {
    updateSecurityPolicyList();
  }, [updateSecurityPolicyList]);

  return (
    <>
      <FormItemSubTitle>
        {t('databaseAccount.create.baseInfo')}
      </FormItemSubTitle>
      <FormItemLabel
        name="username"
        label={t('databaseAccount.create.form.username')}
        rules={[{ required: true }]}
        dependencies={['data_permission_template_uid', 'hostname']}
        className="has-required-style"
      >
        <BasicInput disabled={disabled} />
      </FormItemLabel>
      <FormItemLabel
        name="hostname"
        className="has-required-style has-label-tip"
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.hostname')}
            tips={t('databaseAccount.create.form.hostnameDesc')}
          />
        }
        rules={[{ required: true }]}
      >
        <BasicInput disabled={disabled} />
      </FormItemLabel>
      <FormItemLabel
        name="password"
        label={t('databaseAccount.create.form.password')}
        rules={[{ required: true }]}
        className="has-required-style"
      >
        <InputPassword
          disabled={disabled}
          clickGeneratePassword={generatePassword}
        />
      </FormItemLabel>
      <FormItemLabel
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
        dependencies={['password']}
        className="has-required-style"
      >
        <BasicInput.Password disabled={disabled} />
      </FormItemLabel>
      <FormItemLabel
        label={t('databaseAccount.create.form.policy')}
        name="policy"
        rules={[{ required: true }]}
        className="has-required-style"
      >
        <BasicSelect options={securityPolicyOptions()} disabled={disabled} />
      </FormItemLabel>
      <EmptyBox if={!disabled}>
        <FormItemLabel
          label={t('databaseAccount.create.form.effectiveTimeDay')}
          name="effective_time_day"
          className="has-required-style"
          rules={[{ required: true }]}
        >
          <BasicInputNumber
            disabled={
              (policy !== undefined && policy !== NORMAL_POLICY_VALUE) ||
              disabled
            }
            min={0}
          />
        </FormItemLabel>
      </EmptyBox>
      <FormItemLabel
        label={t('databaseAccount.create.form.desc')}
        name="explanation"
      >
        <BasicInput.TextArea
          disabled={disabled}
          autoSize={{
            maxRows: 10,
            minRows: 2
          }}
          placeholder={t('databaseAccount.create.form.descPlaceholder')}
        />
      </FormItemLabel>
    </>
  );
};

export default BaseInfoForm;
