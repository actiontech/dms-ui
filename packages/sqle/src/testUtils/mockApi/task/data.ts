import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';

export const AuditTaskSQLsMockData: IAuditTaskSQLResV2[] = [
  {
    number: 1,
    exec_sql: 'SELECT 1;',
    sql_source_file: '',
    audit_result: [
      {
        level: 'normal',
        message: 'test message',
        rule_name: '',
        db_type: 'MySQL'
      }
    ],
    audit_level: 'normal',
    audit_status: 'finished',
    exec_result: '',
    exec_status: 'initialized',
    description: 'test'
  }
];

export const workflowTaskDetailMockData = {
  task_id: 'test_task_id',
  instance_name: 'mysql-1',
  instance_db_type: 'MySQL',
  instance_schema: 'test',
  audit_level: '',
  score: 100,
  pass_rate: 1,
  status: 'audited',
  sql_source: ''
};

export const TaskFileListMockData = [
  {
    file_id: '538',
    file_name: 'create_table_if_not_exist.sql',
    exec_order: 1,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '539',
    file_name: 'create_table_roll_back.sql',
    exec_order: 2,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '540',
    file_name: 'new_folder/create_table_if_not_exist.sql',
    exec_order: 3,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '541',
    file_name: 'new_folder/create_table_roll_back.sql',
    exec_order: 4,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '542',
    file_name: 'new_folder/in_folder/create_table_if_not_exist.sql',
    exec_order: 5,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 2,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  },
  {
    file_id: '543',
    file_name: 'new_folder/in_folder/create_table_roll_back.sql',
    exec_order: 6,
    exec_status: 'initialized',
    audit_result_count: {
      error_sql_count: 0,
      warning_sql_count: 0,
      normal_sql_count: 0,
      notice_sql_count: 2
    },
    exec_result_count: null
  }
];
