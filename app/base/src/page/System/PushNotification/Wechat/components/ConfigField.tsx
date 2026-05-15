import { useTranslation } from 'react-i18next';
import { BasicInput, BasicSwitch } from '@actiontech/dms-kit';
import { FormItemLabel } from '@actiontech/dms-kit';
const ConfigField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.wechat.corp_id')}
        name="corp_id"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechat.corp_id')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.wechat.agent_id')}
        name="agent_id"
        rules={[
          {
            required: true
          },
          {
            pattern: /^\d*$/
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechat.agent_id')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.wechat.corp_secret')}
        name="corp_secret"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInput.Password
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechat.corp_secret')
          })}
        />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.wechat.safe_enabled')}
        name="safe_enabled"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel label={t('dmsSystem.wechat.proxy_ip')} name="proxy_ip">
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsSystem.wechat.proxy_ip')
          })}
        />
      </FormItemLabel>
    </>
  );
};
export default ConfigField;
