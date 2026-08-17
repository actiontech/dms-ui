import { BasicInput, BasicSelect } from '@actiontech/dms-kit';
import {
  FormInputBotBorder,
  FormItemNoLabel,
  FormItemLabel
} from '@actiontech/dms-kit';
import { workflowNameRule } from '@actiontech/dms-kit';
import { ReactNode, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import useWorkflowTemplateTips from '../../../../../../hooks/useWorkflowTemplateTips';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import OpsTypeField from './OpsTypeField';

const BaseInfoFormItem = forwardRef<
  HTMLElement,
  {
    slot?: ReactNode;
  }
>(({ slot }, ref) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  // #if [ee]
  const { templateOptions, defaultTemplateId, templateList, loading } =
    useWorkflowTemplateTips(getWorkflowTemplateListV1WorkflowTypeEnum.workflow);
  useEffect(() => {
    if (defaultTemplateId && !form?.getFieldValue('workflow_template_id')) {
      form?.setFieldsValue({
        workflow_template_id: defaultTemplateId
      });
    }
  }, [defaultTemplateId, form]);
  const templateRequired = templateList.length > 1;
  // #endif

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
        name="ops_type_uid"
        label={t('execWorkflow.list.opsType')}
        className="workflow-base-info-ops-type-form-item"
      >
        <OpsTypeField />
      </FormItemLabel>

      {/* #if [ee] */}
      <FormItemLabel
        name="workflow_template_id"
        label={t('execWorkflow.create.form.baseInfo.workflowTemplate')}
        rules={[
          {
            required: templateRequired,
            message: t('common.form.placeholder.select', {
              name: t('execWorkflow.create.form.baseInfo.workflowTemplate')
            })
          }
        ]}
        tooltip={t('execWorkflow.create.form.baseInfo.workflowTemplateTips')}
      >
        <BasicSelect
          loading={loading}
          options={templateOptions}
          placeholder={t('common.form.placeholder.select', {
            name: t('execWorkflow.create.form.baseInfo.workflowTemplate')
          })}
        />
      </FormItemLabel>
      {/* #endif */}

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
});
export default BaseInfoFormItem;
