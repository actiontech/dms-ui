import { BasicInput } from '@actiontech/shared';
import {
  FormInputBotBorder,
  FormItemNoLabel,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { ReactNode, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const BaseInfoFormItem = forwardRef<HTMLElement, { slot?: ReactNode }>(
  ({ slot }, ref) => {
    const { t } = useTranslation();

    return (
      <>
        <section ref={ref}>
          <FormItemNoLabel
            name="workflow_subject"
            rules={[
              {
                required: true,
                message: t('common.form.placeholder.input', {
                  name: t('execWorkflow.create.form.baseInfo.name')
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
                name: t('execWorkflow.create.form.baseInfo.name')
              })}
            />
          </FormItemNoLabel>
        </section>

        {slot}

        <FormItemLabel
          className="workflow-base-info-desc-form-item"
          name="desc"
          label={t('execWorkflow.create.form.baseInfo.describe')}
        >
          <BasicInput.TextArea
            autoSize={{
              maxRows: 10,
              minRows: 8
            }}
            placeholder={t(
              'execWorkflow.create.form.baseInfo.describePlaceholder'
            )}
            maxLength={3000}
            showCount
          />
        </FormItemLabel>
      </>
    );
  }
);

export default BaseInfoFormItem;
