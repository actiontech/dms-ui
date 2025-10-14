import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/dms-kit';
import { BasicInput } from '@actiontech/dms-kit';
const ConfigField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label="AppKey"
        name="appKey"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: 'AppKey'
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label="AppSecret"
        name="appSecret"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: 'AppSecret'
          })}
        />
      </FormItemLabel>
    </>
  );
};
export default ConfigField;
