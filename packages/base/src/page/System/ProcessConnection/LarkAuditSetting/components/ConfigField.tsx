import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput } from '@actiontech/shared';

const ConfigField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label="App ID"
        name="appKey"
        rules={[{ required: true }]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: 'App Key'
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label="App Secret"
        name="appSecret"
        rules={[{ required: true }]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: 'App Secret'
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
