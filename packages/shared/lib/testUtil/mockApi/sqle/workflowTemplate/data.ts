import {
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  WorkflowTemplateDetailResV1WorkflowTypeEnum
} from '../../../../api/sqle/service/common.enum';
import { IWorkflowTemplateDetailResV1 } from '../../../../api/sqle/service/common';

export const workflowTemplateData: IWorkflowTemplateDetailResV1 = {
  workflow_template_id: 1,
  allow_submit_when_less_audit_level:
    WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
  desc: '700300 默认模板',
  is_default: true,
  update_time: '2023-12-26T14:19:12+08:00',
  workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.workflow,
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
  workflow_template_name: '700300-WorkflowTemplate'
};

export const workflowTemplateListData: IWorkflowTemplateDetailResV1[] = [
  workflowTemplateData,
  {
    workflow_template_id: 2,
    allow_submit_when_less_audit_level:
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error,
    desc: '发布审批模板',
    is_default: false,
    update_time: '2023-12-27T10:00:00+08:00',
    workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.workflow,
    workflow_step_template_list: [
      {
        approved_by_authorized: false,
        assignee_user_id_list: ['1739544663515205632'],
        desc: '发布审核',
        execute_by_authorized: false,
        number: 1,
        type: 'sql_review'
      },
      {
        approved_by_authorized: false,
        assignee_user_id_list: [],
        execute_by_authorized: true,
        number: 2,
        type: 'sql_execute'
      }
    ],
    workflow_template_name: 'release-WorkflowTemplate'
  }
];

export const dataExportWorkflowTemplateListData: IWorkflowTemplateDetailResV1[] =
  [
    {
      workflow_template_id: 11,
      allow_submit_when_less_audit_level:
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
      desc: '默认导出审批模板',
      is_default: true,
      update_time: '2023-12-26T14:19:12+08:00',
      workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.data_export,
      workflow_step_template_list: [
        {
          approved_by_authorized: true,
          assignee_user_id_list: [],
          execute_by_authorized: false,
          number: 1,
          type: 'export_review'
        },
        {
          approved_by_authorized: false,
          assignee_user_id_list: [],
          execute_by_authorized: true,
          number: 2,
          type: 'export_execute'
        }
      ],
      workflow_template_name: '700300-DataExportTemplate'
    },
    {
      workflow_template_id: 12,
      allow_submit_when_less_audit_level:
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.error,
      desc: '敏感导出审批模板',
      is_default: false,
      update_time: '2023-12-28T10:00:00+08:00',
      workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.data_export,
      workflow_step_template_list: [
        {
          approved_by_authorized: false,
          assignee_user_id_list: ['1739544663515205632'],
          desc: '敏感审核',
          execute_by_authorized: false,
          number: 1,
          type: 'export_review'
        },
        {
          approved_by_authorized: false,
          assignee_user_id_list: [],
          execute_by_authorized: true,
          number: 2,
          type: 'export_execute'
        }
      ],
      workflow_template_name: 'sensitive-DataExportTemplate'
    }
  ];
