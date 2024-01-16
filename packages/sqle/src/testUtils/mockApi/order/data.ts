import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1SqlSourceEnum,
  AuditTaskResV1StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const orderListData = [
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20240105013651',
    workflow_id: '1743144533085917184',
    desc: '',
    create_user_name: 'admin',
    create_time: '2024-01-05T13:36:57+08:00',
    current_step_type: 'sql_execute',
    current_step_assignee_user_name_list: ['test', 'admin'],
    status: 'wait_for_execution'
  },
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20240105013149',
    workflow_id: '1743143292037500928',
    desc: '',
    create_user_name: 'admin',
    create_time: '2024-01-05T13:32:02+08:00',
    status: 'finished'
  },
  {
    project_name: '700300',
    workflow_name: 'progres-1_20231229024651',
    workflow_id: '1740626773042794496',
    desc: '',
    create_user_name: 'admin',
    create_time: '2023-12-29T14:52:17+08:00',
    status: 'finished'
  },
  {
    project_name: '700300',
    workflow_name: 'mysql-1_20231227103222',
    workflow_id: '1739836656367702016',
    desc: '',
    create_user_name: 'admin',
    create_time: '2023-12-27T10:32:38+08:00',
    current_step_type: 'sql_review',
    current_step_assignee_user_name_list: ['test', 'admin'],
    status: 'wait_for_audit'
  }
];

export const WorkflowTemplateData = {
  workflow_template_name: '700300-WorkflowTemplate',
  desc: '700300 默认模板',
  allow_submit_when_less_audit_level: 'warn',
  workflow_step_template_list: [
    {
      number: 1,
      type: 'sql_review',
      approved_by_authorized: false,
      execute_by_authorized: false,
      assignee_user_id_list: ['1742425227977035776']
    },
    {
      number: 2,
      type: 'sql_execute',
      approved_by_authorized: false,
      execute_by_authorized: true,
      assignee_user_id_list: []
    }
  ],
  update_time: '2024-01-09T11:00:33Z'
};

export const AuditTaskResData: IAuditTaskResV1[] = [
  {
    audit_level: AuditTaskResV1AuditLevelEnum.error,
    exec_end_time: '2024-01-09T11:00:33Z',
    exec_start_time: '2024-01-08T11:00:33Z',
    instance_db_type: 'mysql',
    instance_name: 'instance_name b',
    instance_schema: 'instance_schema',
    pass_rate: 20,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 1
  },
  {
    audit_level: AuditTaskResV1AuditLevelEnum.warn,
    exec_end_time: '2024-01-06T11:00:33Z',
    exec_start_time: '2024-01-05T11:00:33Z',
    instance_db_type: 'mysql',
    instance_name: 'instance_name a',
    instance_schema: 'instance_schema 1',
    pass_rate: 30,
    score: 40,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 2
  }
];
