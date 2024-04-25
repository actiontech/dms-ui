import {
  FormInputBotBorder,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';

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
          },
          {
            validator: workflowNameRule()
          },
          {
            max: 59
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
