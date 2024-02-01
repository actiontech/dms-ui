import {
  IAddDataExportTaskReply,
  IAddDataExportWorkflowReply,
  IGetDataExportTask,
  IListDataExportTaskSQL,
  IListDataExportWorkflow
} from '@actiontech/shared/lib/api/base/service/common';
import {
  GetDataExportTaskStatusEnum,
  ListDataExportWorkflowStatusEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';

export const DataExportWorkflowList: IListDataExportWorkflow[] = [
  {
    project_uid: '700300',
    workflow_uid: '1752172808714063872',
    workflow_name: 'mysql-1_20240130113114',
    desc: 'desc',
    creater: {
      uid: '700200',
      name: 'admin'
    },
    created_at: '2024-01-30T11:32:06.053+08:00',
    exported_at: '2024-01-30T11:33:06.053+08:00',
    status: ListDataExportWorkflowStatusEnum.finish,
    current_step_assignee_user_list: [],
    current_step_type: ''
  },
  {
    project_uid: '700300',
    workflow_uid: '1752172808714063871',
    workflow_name: 'mysql-2_20240130113114',
    desc: 'desc',
    creater: {
      uid: '700200',
      name: 'admin'
    },
    created_at: '2024-01-30T11:32:06.053+08:00',
    exported_at: '2024-01-30T11:33:06.053+08:00',
    status: ListDataExportWorkflowStatusEnum.wait_for_approve,
    current_step_assignee_user_list: [
      {
        uid: '700200',
        name: 'admin'
      }
    ],
    current_step_type: ''
  }
];

export const AddDataExportTaskResponseData: IAddDataExportTaskReply['data'] = {
  data_export_task_uids: ['1752522203951271936']
};

export const AddDataExportWorkflowResponseData: IAddDataExportWorkflowReply['data'] =
  {
    export_data_workflow_uid: '1483489234842342'
  };

export const BatchGetDataExportTaskResponseData: IGetDataExportTask[] = [
  {
    task_uid: '1752623436938612736',
    db_info: {
      uid: '1752583372904861696',
      name: 'bl1',
      db_type: '',
      database_name: ''
    },
    status: GetDataExportTaskStatusEnum.init,
    file_name: '',
    audit_result: {
      audit_level: '',
      score: 100,
      pass_rate: 1
    },
    export_type: 'SQL',
    export_file_type: 'CSV'
  }
];

export const ListDataExportTaskSQLsResponseData: IListDataExportTaskSQL[] = [
  {
    uid: 1,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  },
  {
    uid: 2,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  },
  {
    uid: 3,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  },
  {
    uid: 4,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  },
  {
    uid: 5,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  },
  {
    uid: 6,
    sql: 'SELECT 1;',
    export_status: '',
    export_sql_type: 'dql',
    audit_level: ''
  }
];
