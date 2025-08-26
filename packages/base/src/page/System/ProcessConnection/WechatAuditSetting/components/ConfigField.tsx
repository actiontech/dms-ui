import { useTranslation } from 'react-i18next';
import { FormItemLabel } from '@actiontech/dms-kit';
import { BasicInput } from '@actiontech/dms-kit';
const ConfigField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.wechatAudit.corpID')}
        name="corpID"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechatAudit.corpID')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.wechatAudit.corpSecret')}
        name="corpSecret"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechatAudit.corpSecret')
          })}
        />
      </FormItemLabel>
    </>
  );
};
export default ConfigField;
