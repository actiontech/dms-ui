import {
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  WorkflowTemplateTypeEnum
} from '../../../../api/sqle/service/common.enum';

export const workflowTemplateData = {
  allow_submit_when_less_audit_level:
    WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
  desc: '700300 默认模板',
  update_time: '2023-12-26T14:19:12+08:00',
  workflow_step_template_list: [
    {
      approved_by_authorized: true,
      assignee_user_id_list: [],
      execute_by_authorized: false,
      number: 1,
      type: 'sql_review'
    },
    {
      approved_by_authorized: false,
      assignee_user_id_list: ['1739544663515205632'],
      desc: 'step desc',
      execute_by_authorized: false,
      number: 2,
      type: 'sql_review'
    },
    {
      approved_by_authorized: false,
      assignee_user_id_list: [],
      execute_by_authorized: true,
      number: 3,
      type: 'sql_execute'
    }
  ],
  workflow_template_name: '700300-WorkflowTemplate',
  workflow_type: WorkflowTemplateTypeEnum.workflow
};

export const dataExportWorkflowTemplateData = {
  desc: '数据导出审批流程',
  update_time: '2024-01-15T10:30:00+08:00',
  workflow_step_template_list: [
    {
      approved_by_authorized: true,
      assignee_user_id_list: [],
      execute_by_authorized: false,
      number: 1,
      type: 'export_review'
    }
  ],
  workflow_template_name: '数据导出审批流程',
  workflow_type: WorkflowTemplateTypeEnum.data_export
};

export const workflowTemplateListData = {
  workflow_template_list: [workflowTemplateData, dataExportWorkflowTemplateData]
};
