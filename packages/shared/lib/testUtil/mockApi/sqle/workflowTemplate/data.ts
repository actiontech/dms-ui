import { IWorkflowTemplateDetailResV1 } from '../../../../api/sqle/service/common';
import {
  WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum,
  WorkflowTemplateDetailResV1WorkflowTypeEnum
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
  workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.workflow
};

export const dataExportWorkflowTemplateData: IWorkflowTemplateDetailResV1 = {
  desc: '',
  update_time: '2024-01-15T10:30:00+08:00',
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
  workflow_template_name: '700300-DataExportWorkflowTemplate',
  workflow_type: WorkflowTemplateDetailResV1WorkflowTypeEnum.data_export
};

/**
 * Steps returned from API in wrong order (sql_execute first, then sql_review by descending number).
 * Used to verify that the frontend correctly extracts steps by type and sorts review steps by number.
 * Expected result after processing:
 *   reviewSteps (sorted by number): [number:1 sql_review, number:2 sql_review]
 *   execStep: number:3 sql_execute
 */
export const workflowTemplateOutOfOrderData = {
  ...workflowTemplateData,
  workflow_step_template_list: [
    {
      approved_by_authorized: false,
      assignee_user_id_list: [],
      execute_by_authorized: true,
      number: 3,
      type: 'sql_execute'
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
      approved_by_authorized: true,
      assignee_user_id_list: [],
      execute_by_authorized: false,
      number: 1,
      type: 'sql_review'
    }
  ]
};

/**
 * Export steps returned from API in wrong order (export_execute first).
 * Expected result after processing:
 *   reviewSteps (sorted by number): [number:1 export_review]
 *   execStep: number:2 export_execute
 */
export const dataExportWorkflowTemplateOutOfOrderData: IWorkflowTemplateDetailResV1 =
  {
    ...dataExportWorkflowTemplateData,
    workflow_step_template_list: [
      {
        approved_by_authorized: false,
        assignee_user_id_list: [],
        execute_by_authorized: true,
        number: 2,
        type: 'export_execute'
      },
      {
        approved_by_authorized: true,
        assignee_user_id_list: [],
        execute_by_authorized: false,
        number: 1,
        type: 'export_review'
      }
    ]
  };

export const workflowTemplateListData = [
  workflowTemplateData,
  dataExportWorkflowTemplateData
];
