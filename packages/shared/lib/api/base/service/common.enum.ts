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

export enum ListMemberRoleWithOpRangeOpRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum ListOpPermissionRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum ListRoleStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知'
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

export enum ListUserGroupStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知'
}

export enum MemberRoleWithOpRangeOpRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
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

  'sql_query' = 'sql_query'
}

export enum OpPermissionItemRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum {
  'normal' = 'normal',

  'notice' = 'notice',

  'warn' = 'warn',

  'error' = 'error'
}

export enum TestFeishuConfigurationAccountTypeEnum {
  'email' = 'email',

  'phone' = 'phone'
}
