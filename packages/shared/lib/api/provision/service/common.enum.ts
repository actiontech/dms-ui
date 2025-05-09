export enum AccountDetailPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
}

export enum AddDBAccountPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
}

export enum AddDataObjectSourceNameEnum {
  'Actiontech DMP' = 'Actiontech DMP',

  'Actiontech DMS' = 'Actiontech DMS'
}

export enum BatchUpdateDBAccountPasswordPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
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

  'unlock' = 'unlock',

  'expired' = 'expired'
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

  '未知' = '未知',

  'Normal' = 'Normal',

  'Disabled' = 'Disabled',

  'Unknown' = 'Unknown'
}

export enum ListDBAccountPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
}

export enum ListDBAccountStatusEnum {
  'lock' = 'lock',

  'unlock' = 'unlock',

  'expired' = 'expired'
}

export enum ListDBServiceLastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum ListDBServiceV2LastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum ListMemberRoleWithOpRangeOpRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum ListProjectV1ProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
}

export enum ListProjectV2ProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
}

export enum ListServiceDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBase For MySQL' = 'OceanBase For MySQL',

  'Oracle' = 'Oracle'
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

  '未知' = '未知',

  'Normal' = 'Normal',

  'Disabled' = 'Disabled',

  'Unknown' = 'Unknown'
}

export enum OpPermissionItemOpPermissionTypeEnum {
  'unknown' = 'unknown',

  'create_project' = 'create_project',

  'global_view' = 'global_view',

  'global_management' = 'global_management',

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

  'audit_export_workflow' = 'audit_export_workflow',

  'create_optimization' = 'create_optimization',

  'view_others_optimization' = 'view_others_optimization',

  'create_pipeline' = 'create_pipeline'
}

export enum OpPermissionItemRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum OperationScopeEnum {
  'Service' = 'Service',

  'Instance' = 'Instance',

  'Database' = 'Database',

  'Table' = 'Table'
}

export enum OperationInfoDataObjectTypesEnum {
  'Service' = 'Service',

  'Instance' = 'Instance',

  'Database' = 'Database',

  'Table' = 'Table'
}

export enum OperationInfoDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBase For MySQL' = 'OceanBase For MySQL',

  'Oracle' = 'Oracle'
}

export enum PasswordConfigPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
}

export enum PlatformManagedPasswordExpirationPolicyEnum {
  'expiration_lock' = 'expiration_lock',

  'expiration_available' = 'expiration_available'
}

export enum SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum ServiceDbTypeEnum {
  'MySQL' = 'MySQL',

  'OceanBase For MySQL' = 'OceanBase For MySQL',

  'Oracle' = 'Oracle'
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
