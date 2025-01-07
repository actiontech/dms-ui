import { useTranslation } from 'react-i18next';
import { BasicInput, BasicSwitch } from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { validatorPort } from '@actiontech/shared/lib/utils/FormRule';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsSystem.smtp.isSkipVerify')}
            tips={t('dmsSystem.smtp.skipVerifyTips')}
          />
        }
        name="isSkipVerify"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.smtp.host')}
        name="host"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.smtp.host')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.smtp.port')}
        name="port"
        rules={[
          {
            required: true
          },
          {
            validator: validatorPort()
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.smtp.port')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.smtp.username')}
        name="username"
        rules={[
          {
            required: true
          },
          {
            type: 'email'
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.smtp.username')
          })}
        />
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.smtp.password')}
        name="password"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.smtp.password')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.smtp.passwordConfirm')}
        name="passwordConfirm"
        dependencies={['password']}
        rules={[
          {
            required: true
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(t('common.form.rule.passwordNotMatch'))
              );
            }
          })
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.smtp.passwordConfirm')
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
