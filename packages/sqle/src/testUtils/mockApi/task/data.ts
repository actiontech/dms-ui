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
