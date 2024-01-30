import { useTranslation } from 'react-i18next';

import { BasicInput, BasicInputNumber } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label="Webhook url"
        name="url"
        rules={[
          {
            required: true,
            type: 'url'
          }
        ]}
      >
        <BasicInput />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.webhook.maxRetryTimes')}
        name="maxRetryTimes"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInputNumber min={0} max={5} />
      </FormItemLabel>
      <FormItemLabel
        className="has-required-style"
        label={t('dmsSystem.webhook.retryIntervalSeconds')}
        name="retryIntervalSeconds"
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicInputNumber min={1} max={5} />
      </FormItemLabel>
      <FormItemLabel label="token" name="token">
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: 'token'
          })}
        />
      </FormItemLabel>
    </>
  );
};

export default ConfigField;
