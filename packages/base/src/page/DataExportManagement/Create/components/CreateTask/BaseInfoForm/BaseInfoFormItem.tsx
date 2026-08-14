import { BasicInput, BasicSelect } from '@actiontech/dms-kit';
import {
  FormInputBotBorder,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/dms-kit';
import { workflowNameRule } from '@actiontech/dms-kit';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import useWorkflowTemplateTips from '../../../../../../hooks/useWorkflowTemplateTips';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import OpsTypeField from './OpsTypeField';

const BaseInfoFormItem: React.FC<{ slot?: ReactNode }> = ({ slot }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const { templateOptions, defaultTemplateId, templateList, loading } =
    useWorkflowTemplateTips(
      getWorkflowTemplateListV1WorkflowTypeEnum.data_export
    );

  useEffect(() => {
    if (defaultTemplateId && !form?.getFieldValue('workflow_template_id')) {
      form?.setFieldsValue({
        workflow_template_id: defaultTemplateId
      });
    }
  }, [defaultTemplateId, form]);

  const templateRequired = templateList.length > 1;

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
        name="ops_type_uid"
        label={t('dmsDataExport.list.column.opsType')}
        className="workflow-base-info-ops-type-form-item"
      >
        <OpsTypeField />
      </FormItemLabel>

      <FormItemLabel
        name="workflow_template_id"
        label={t('dmsDataExport.create.form.base.workflowTemplate')}
        rules={[
          {
            required: templateRequired,
            message: t('common.form.placeholder.select', {
              name: t('dmsDataExport.create.form.base.workflowTemplate')
            })
          }
        ]}
        tooltip={t('dmsDataExport.create.form.base.workflowTemplateTips')}
      >
        <BasicSelect
          loading={loading}
          options={templateOptions}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.base.workflowTemplate')
          })}
        />
      </FormItemLabel>

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
