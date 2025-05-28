import React, { useMemo, useEffect } from 'react';
import { Form, Typography, FormRule } from 'antd';
import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/CustomForm';
import InputPassword from '../../../components/PasswordWithGenerate';
import useCustomDBPasswordRule from '../hooks/useCustomDBPasswordRule';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { CheckCircleOutlined } from '@actiontech/icons';
import {
  PasswordFieldExtraStyleWrapper,
  PasswordFieldStyleWrapper
} from './style';
import { AccountPassword, PasswordFieldProps } from '../index.type';

const PasswordField: React.FC<PasswordFieldProps> = ({
  disabled,
  showLabelTips = true
}) => {
  const form = Form.useFormInstance<AccountPassword>();
  const password = Form.useWatch('password', form);
  const { t } = useTranslation();
  const {
    getCustomPasswordRule,
    passwordRules,
    generatePasswordByRule,
    customPasswordRule
  } = useCustomDBPasswordRule();

  const ruleStatus = useMemo(() => {
    return passwordRules.map((rule) => rule.validate(password));
  }, [password, passwordRules]);

  useEffect(() => {
    getCustomPasswordRule();
  }, [getCustomPasswordRule]);

  const generatePassword = () => {
    const fullRulePassword = generatePasswordByRule();
    form.setFieldsValue({
      password: fullRulePassword,
      confirm_password: fullRulePassword
    });
    return fullRulePassword;
  };

  return (
    <>
      <PasswordFieldStyleWrapper
        name="password"
        label={
          <EmptyBox
            if={showLabelTips}
            defaultNode={t('databaseAccount.create.form.password')}
          >
            <CustomLabelContent
              title={t('databaseAccount.create.form.password')}
              tips={t('databaseAccount.create.form.passwordTips')}
            />
          </EmptyBox>
        }
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('databaseAccount.create.form.password')
            })
          },
          ...passwordRules.map((rule): FormRule => {
            return {
              validator(_, value) {
                if (rule.validate(value)) {
                  return Promise.resolve();
                }
                return Promise.reject();
              }
            };
          })
        ]}
        className="has-required-style has-label-tip"
        extra={
          <EmptyBox if={!!password}>
            <PasswordFieldExtraStyleWrapper>
              {passwordRules.map((rule, idx) => (
                <div key={rule.label} className="item">
                  <span className="item-icon">
                    {ruleStatus[idx] ? <CheckCircleOutlined /> : ''}
                  </span>
                  <Typography.Text
                    type={ruleStatus[idx] ? 'success' : 'danger'}
                  >
                    {rule.label}
                  </Typography.Text>
                </div>
              ))}
            </PasswordFieldExtraStyleWrapper>
          </EmptyBox>
        }
      >
        <InputPassword
          clickGeneratePassword={generatePassword}
          disabled={disabled}
          minLength={customPasswordRule?.min_length}
        />
      </PasswordFieldStyleWrapper>
      <FormItemLabel
        name="confirm_password"
        label={
          <EmptyBox
            if={showLabelTips}
            defaultNode={t('databaseAccount.create.form.confirmPassword')}
          >
            <CustomLabelContent
              title={t('databaseAccount.create.form.confirmPassword')}
              tips={t('databaseAccount.create.form.confirmPasswordTips')}
            />
          </EmptyBox>
        }
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('databaseAccount.create.form.confirmPassword')
            })
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('databaseAccount.create.form.passwordError'))
              );
            }
          })
        ]}
        dependencies={['password']}
        className="has-required-style has-label-tip"
      >
        <BasicInput.Password disabled={disabled} />
      </FormItemLabel>
    </>
  );
};

export default PasswordField;
