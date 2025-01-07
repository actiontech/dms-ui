import { useTranslation } from 'react-i18next';

import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput } from '@actiontech/shared';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.codingDocking.serviceAddress')}
        name="codingUrl"
        rules={[{ required: true }]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.codingDocking.serviceAddress')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.codingDocking.accessToken')}
        name="token"
        rules={[{ required: true }]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.codingDocking.accessToken')
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
