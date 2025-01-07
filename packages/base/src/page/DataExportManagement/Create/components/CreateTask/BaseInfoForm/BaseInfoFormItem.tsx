import {
  BasicInput,
  FormInputBotBorder,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const BaseInfoFormItem: React.FC<{ slot?: ReactNode }> = ({ slot }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemNoLabel
        name="workflow_subject"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('dmsDataExport.create.form.base.name')
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
            name: t('dmsDataExport.create.form.base.name')
          })}
        />
      </FormItemNoLabel>

      {slot}

      <FormItemLabel
        className="workflow-base-info-desc-form-item"
        name="desc"
        label={t('dmsDataExport.create.form.base.describe')}
      >
        <BasicInput.TextArea
          autoSize={{
            maxRows: 10,
            minRows: 8
          }}
          placeholder={t('dmsDataExport.create.form.base.describePlaceholder')}
          maxLength={3000}
          showCount
        />
      </FormItemLabel>
    </>
  );
};

export default BaseInfoFormItem;
