export enum AddDataObjectSourceNameEnum {
  'Actiontech DMP' = 'Actiontech DMP',

  'Actiontech DMS' = 'Actiontech DMS'
}

export enum DMSProxyTargetScenarioEnum {
  'internal_service' = 'internal_service',

  'thrid_party_integrate' = 'thrid_party_integrate'
}

export enum DataObjectSourceNameEnum {
  'Actiontech DMP' = 'Actiontech DMP',

  'Actiontech DMS' = 'Actiontech DMS'
}

export enum DelDataObjectSourceDeleteModEnum {
  'Delete' = 'Delete',

  'DeleteIgnoreDataPermissionTemplate' = 'DeleteIgnoreDataPermissionTemplate'
}

export enum StatusEnum {
  'lock' = 'lock',

  'unlock' = 'unlock'
}

export enum GetUserAuthenticationTypeEnum {
  'ldap' = 'ldap',

  'dms' = 'dms',

  'oauth2' = 'oauth2',

  'unknown' = 'unknown'
}

export enum GetUserStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知'
}

export enum ListAuthorizationStatusEnum {
  'expired' = 'expired',

  'expiring' = 'expiring',

  'effective' = 'effective'
}

export enum ListDBAccountStatusEnum {
  'lock' = 'lock',

  'unlock' = 'unlock'
}

export enum ListServiceDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBaseMySQL' = 'OceanBaseMySQL'
}

export enum ListServiceTypeEnum {
  'Service' = 'Service',

  'Instance' = 'Instance',

  'Database' = 'Database',

  'Table' = 'Table'
}

export enum ListUserAuthenticationTypeEnum {
  'ldap' = 'ldap',

  'dms' = 'dms',

  'oauth2' = 'oauth2',

  'unknown' = 'unknown'
}

export enum ListUserStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知'
}

export enum OpPermissionItemOpPermissionTypeEnum {
  'unknown' = 'unknown',

  'create_project' = 'create_project',

  'project_admin' = 'project_admin',

  'create_workflow' = 'create_workflow',

  'audit_workflow' = 'audit_workflow',

  'auth_db_service_data' = 'auth_db_service_data',

  'view_others_workflow' = 'view_others_workflow',

  'execute_workflow' = 'execute_workflow',

  'view_other_audit_plan' = 'view_other_audit_plan',

  'save_audit_plan' = 'save_audit_plan',

  'sql_query' = 'sql_query',

  'create_export_task' = 'create_export_task',

  'audit_export_workflow' = 'audit_export_workflow'
}

export enum OpPermissionItemRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum OperationInfoDataObjectTypesEnum {
  'Service' = 'Service',

  'Instance' = 'Instance',

  'Database' = 'Database',

  'Table' = 'Table'
}

export enum OperationInfoDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBaseMySQL' = 'OceanBaseMySQL'
}

export enum SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum ServiceDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBaseMySQL' = 'OceanBaseMySQL'
}

export enum SyncRuleFieldNameEnum {
  'name' = 'name',

  'address' = 'address',

  'db_type' = 'db_type',

  'business' = 'business'
}

export enum SyncRuleRuleNameEnum {
  'exact_match' = 'exact_match',

  'regex' = 'regex'
}
