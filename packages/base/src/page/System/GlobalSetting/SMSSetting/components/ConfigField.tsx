import { useTranslation } from 'react-i18next';

import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput } from '@actiontech/shared';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label="url"
        name="url"
        rules={[{ required: true }]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: 'url'
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label="token"
        name="token"
        rules={[{ required: true }]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: 'token'
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
