import { useTranslation } from 'react-i18next';

import { BasicInput, BasicSwitch } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

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
        <BasicInput />
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
        <BasicInput />
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
        <BasicInput.Password />
      </FormItemLabel>
      <FormItemLabel
        label={t('dmsSystem.wechat.safe_enabled')}
        name="safe_enabled"
        valuePropName="checked"
      >
        <BasicSwitch />
      </FormItemLabel>
      <FormItemLabel label={t('dmsSystem.wechat.proxy_ip')} name="proxy_ip">
        <BasicInput />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
