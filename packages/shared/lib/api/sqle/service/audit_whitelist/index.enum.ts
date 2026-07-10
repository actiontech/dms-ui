/* tslint:disable no-duplicate-string */

export enum getAuditWhitelistV1FilterTypeEnum {
  sql = 'sql',

  fp_sql = 'fp_sql',

  instance = 'instance',

  audit_task_type = 'audit_task_type',

  audit_task_id = 'audit_task_id',

  db_type = 'db_type',

  sql_source = 'sql_source'
}

export enum getAuditWhitelistV1FilterRuleScopeModeEnum {
  all = 'all',

  specific = 'specific'
}

export enum getAuditWhitelistV1FilterSqlSourceEnum {
  sql_audit_record = 'sql_audit_record',

  audit_plan = 'audit_plan'
}
