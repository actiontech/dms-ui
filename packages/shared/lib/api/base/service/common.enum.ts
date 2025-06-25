export enum DBServiceIsConnectableReplyConnectionStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum DMSProxyTargetScenarioEnum {
  'internal_service' = 'internal_service',

  'thrid_party_integrate' = 'thrid_party_integrate'
}

export enum GetDataExportTaskStatusEnum {
  'init' = 'init',

  'exporting' = 'exporting',

  'finish' = 'finish',

  'failed' = 'failed',

  'file_deleted' = 'file_deleted'
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

export enum ListDBServiceLastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum ListDBServiceV2LastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum ListDataExportWorkflowStatusEnum {
  'wait_for_approve' = 'wait_for_approve',

  'wait_for_export' = 'wait_for_export',

  'exporting' = 'exporting',

  'rejected' = 'rejected',

  'cancel' = 'cancel',

  'failed' = 'failed',

  'finish' = 'finish'
}

export enum ListGlobalDBServiceLastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
}

export enum ListGlobalDBServiceV2LastConnectionTestStatusEnum {
  'connect_success' = 'connect_success',

  'connect_failed' = 'connect_failed'
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

export enum ListOpPermissionServiceEnum {
  'dms' = 'dms',

  'sqle' = 'sqle'
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

export enum ListRoleStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知',

  'Normal' = 'Normal',

  'Disabled' = 'Disabled',

  'Unknown' = 'Unknown'
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

export enum ListUserGroupStatEnum {
  '正常' = '正常',

  '被禁用' = '被禁用',

  '未知' = '未知',

  'Normal' = 'Normal',

  'Disabled' = 'Disabled',

  'Unknown' = 'Unknown'
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

  'create_pipeline' = 'create_pipeline',

  'view_operation_record' = 'view_operation_record',

  'view_export_task' = 'view_export_task',

  'view_quick_audit_record' = 'view_quick_audit_record',

  'view_ide_audit_record' = 'view_ide_audit_record',

  'view_optimization_record' = 'view_optimization_record',

  'version_manage' = 'version_manage',

  'view_pipeline' = 'view_pipeline',

  'view_pending_sql_manage' = 'view_pending_sql_manage',

  'manage_project_data_source' = 'manage_project_data_source',

  'manage_audit_rule_template' = 'manage_audit_rule_template',

  'manage_approval_template' = 'manage_approval_template',

  'manage_member' = 'manage_member',

  'manage_push_rule' = 'manage_push_rule',

  'manage_audit_sql_white_list' = 'manage_audit_sql_white_list',

  'manage_sql_mange_white_list' = 'manage_sql_mange_white_list',

  'manage_role_mange' = 'manage_role_mange',

  'desensitization' = 'desensitization',

  'none' = 'none'
}

export enum OpPermissionItemRangeTypeEnum {
  'unknown' = 'unknown',

  'global' = 'global',

  'project' = 'project',

  'db_service' = 'db_service'
}

export enum OperationOperationTypeEnum {
  'SQL' = 'SQL'
}

export enum ProjectV1ProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
}

export enum ProjectV2ProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
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

export enum UpdateProjectProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
}

export enum UpdateProjectV2ProjectPriorityEnum {
  'high' = 'high',

  'medium' = 'medium',

  'low' = 'low',

  'unknown' = 'unknown'
}

export enum WorkflowRecordStatusEnum {
  'wait_for_approve' = 'wait_for_approve',

  'wait_for_export' = 'wait_for_export',

  'exporting' = 'exporting',

  'rejected' = 'rejected',

  'cancel' = 'cancel',

  'failed' = 'failed',

  'finish' = 'finish'
}

export enum WorkflowStepStateEnum {
  'init' = 'init',

  'rejected' = 'rejected',

  'finish' = 'finish'
}
