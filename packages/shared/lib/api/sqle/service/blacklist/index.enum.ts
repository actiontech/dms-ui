/* tslint:disable no-duplicate-string */

export enum getBlacklistV1FilterTypeEnum {
  sql = 'sql',

  fp_sql = 'fp_sql',

  ip = 'ip',

  cidr = 'cidr',

  host = 'host',

  instance = 'instance',

  db_user = 'db_user',

  audit_task_type = 'audit_task_type',

  audit_task_id = 'audit_task_id'
}

export enum getBlacklistV1FilterRuleScopeModeEnum {
  all = 'all',

  specific = 'specific'
}
