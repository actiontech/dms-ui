import {
  FormInputBotBorder,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';

const BaseInfoFormItem = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemNoLabel
        name="optimizationName"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('sqlOptimization.create.base.name')
            })
          }
        ]}
      >
        <FormInputBotBorder
          className="workflow-name-input-wrapper"
          placeholder={t('common.form.placeholder.input', {
            name: t('sqlOptimization.create.base.name')
          })}
        />
      </FormItemNoLabel>
    </>
  );
};

export default BaseInfoFormItem;
