import { ISQLAuditRecord } from '../../../../api/sqle/service/common';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1StatusEnum,
  AuditTaskResV1SqlSourceEnum
} from '../../../../api/sqle/service/common.enum';

export const sqlAuditRecordMockData: ISQLAuditRecord[] = [
  {
    creator: 'admin',
    sql_audit_record_id: '123456',
    sql_audit_status: 'successfully',
    tags: ['test'],
    instance: {
      db_host: '10.196.62.23',
      db_port: '3333'
    },
    task: {
      task_id: 12,
      instance_name: 'mysql-1',
      instance_db_type: 'MySQL',
      instance_schema: 'test',
      audit_level: AuditTaskResV1AuditLevelEnum.normal,
      score: 100,
      pass_rate: 1,
      status: AuditTaskResV1StatusEnum.audited,
      sql_source: AuditTaskResV1SqlSourceEnum.form_data
    },
    created_at: '2024-01-08T10:18:28+08:00'
  },
  {
    creator: 'admin',
    sql_audit_record_id: '234567',
    sql_audit_status: 'successfully',
    tags: undefined,
    instance: {
      db_host: '10.196.62.24',
      db_port: '3334'
    },
    task: {
      task_id: 13,
      instance_name: 'mysql-1',
      instance_db_type: 'MySQL',
      instance_schema: 'test',
      audit_level: AuditTaskResV1AuditLevelEnum.warn,
      score: 100,
      pass_rate: 1,
      status: AuditTaskResV1StatusEnum.exec_success,
      sql_source: AuditTaskResV1SqlSourceEnum.sql_file
    },
    created_at: '2024-01-07T10:18:28+08:00'
  },
  {
    creator: '',
    sql_audit_record_id: '',
    sql_audit_status: '',
    tags: undefined,
    instance: {
      db_host: '10.196.62.24',
      db_port: '3334'
    },
    task: {
      task_id: 13,
      instance_name: '',
      instance_db_type: 'MySQL',
      instance_schema: 'test',
      audit_level: AuditTaskResV1AuditLevelEnum.warn,
      score: 100,
      pass_rate: 1,
      status: AuditTaskResV1StatusEnum.exec_success,
      sql_source: AuditTaskResV1SqlSourceEnum.sql_file
    },
    created_at: '2024-01-07T10:18:28+08:00'
  }
];

export const sqlAuditRecordTagTipsMockData: string[] = ['test', 'test1'];

export const createSqlAuditResponseMockData = {
  sql_audit_record_id: '17453290776064',
  task: {
    task_id: 1,
    instance_name: 'mysql1',
    instance_db_type: 'MySQL',
    instance_schema: 'testSchema',
    audit_level: '',
    score: 100,
    pass_rate: 1,
    status: 'audited',
    sql_source: 'form_data'
  }
};
