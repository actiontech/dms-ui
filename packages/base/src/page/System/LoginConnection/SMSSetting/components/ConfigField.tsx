import { useTranslation } from 'react-i18next';

import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { BasicInput } from '@actiontech/shared';

const ConfigField = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-required-style has-label-tip"
        label={
          <CustomLabelContent
            title="url"
            tips={t('dmsSystem.global.smsSetting.urlTips')}
          />
        }
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
        className="has-required-style has-label-tip"
        label={
          <CustomLabelContent
            title="token"
            tips={t('dmsSystem.global.smsSetting.tokenTips')}
          />
        }
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
