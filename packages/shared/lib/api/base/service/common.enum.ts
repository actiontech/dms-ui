export enum ActivateUnmaskingWorkflowViewReplyDataViewStateEnum {
  not_activated = 'not_activated',

  active = 'active',

  view_expired = 'view_expired',

  activation_expired = 'activation_expired'
}

export enum AddSensitiveDataDiscoveryTaskExecutionPlanEnum {
  PERIODIC = 'PERIODIC',

  ONE_TIME = 'ONE_TIME'
}

export enum AddSensitiveDataDiscoveryTaskIdentificationMethodEnum {
  BY_FIELD_NAME = 'BY_FIELD_NAME',

  BY_SAMPLE_DATA = 'BY_SAMPLE_DATA'
}

export enum ColumnMaskingConfigConfidenceEnum {
  High = 'High',

  Medium = 'Medium',

  Low = 'Low'
}

export enum ColumnMaskingConfigStatusEnum {
  PENDING_CONFIRM = 'PENDING_CONFIRM',

  CONFIGURED = 'CONFIGURED',

  SYSTEM_CONFIRMED = 'SYSTEM_CONFIRMED'
}

export enum CreateUnmaskingWorkflowSourceTypeEnum {
  data_export = 'data_export',

  sql_workbench = 'sql_workbench'
}

export enum DBServiceIsConnectableReplyConnectionStatusEnum {
  connect_success = 'connect_success',

  connect_failed = 'connect_failed'
}

export enum DMSProxyTargetScenarioEnum {
  internal_service = 'internal_service',

  thrid_party_integrate = 'thrid_party_integrate'
}

export enum DataExportRelatedUnmaskingWorkflowApprovalStatusEnum {
  pending = 'pending',

  approved = 'approved',

  rejected = 'rejected',

  cancelled = 'cancelled'
}

export enum DataExportRelatedUnmaskingWorkflowUsageStatusEnum {
  unviewed = 'unviewed',

  viewed = 'viewed'
}

export enum GetDataExportTaskStatusEnum {
  init = 'init',

  exporting = 'exporting',

  finish = 'finish',

  failed = 'failed',

  file_deleted = 'file_deleted'
}

export enum GetUnmaskingWorkflowPlaintextViewStateEnum {
  not_activated = 'not_activated',

  active = 'active',

  view_expired = 'view_expired',

  activation_expired = 'activation_expired'
}

export enum GetUserAuthenticationTypeEnum {
  ldap = 'ldap',

  dms = 'dms',

  oauth2 = 'oauth2',

  unknown = 'unknown'
}

export enum GetUserStatEnum {
  正常 = '正常',

  被禁用 = '被禁用',

  未知 = '未知',

  Normal = 'Normal',

  Disabled = 'Disabled',

  Unknown = 'Unknown'
}

export enum GetUserSystemEnum {
  WORKBENCH = 'WORKBENCH',

  MANAGEMENT = 'MANAGEMENT'
}

export enum GlobalDataExportWorkflowStatusEnum {
  wait_for_approve = 'wait_for_approve',

  wait_for_export = 'wait_for_export',

  exporting = 'exporting',

  rejected = 'rejected',

  cancel = 'cancel',

  failed = 'failed',

  finish = 'finish'
}

export enum LineageEdgeTypeEnum {
  direct = 'direct',

  transform = 'transform',

  aggregate = 'aggregate'
}

export enum LineageNodeTypeEnum {
  source_column = 'source_column',

  expression = 'expression',

  result_column = 'result_column',

  table = 'table'
}

export enum ListDBServiceLastConnectionTestStatusEnum {
  connect_success = 'connect_success',

  connect_failed = 'connect_failed'
}

export enum ListDBServiceV2LastConnectionTestStatusEnum {
  connect_success = 'connect_success',

  connect_failed = 'connect_failed'
}

export enum ListDataExportTaskSQLExportStatusEnum {
  success = 'success',

  failed = 'failed',

  not_executed = 'not_executed'
}

export enum ListDataExportWorkflowStatusEnum {
  wait_for_approve = 'wait_for_approve',

  wait_for_export = 'wait_for_export',

  exporting = 'exporting',

  rejected = 'rejected',

  cancel = 'cancel',

  failed = 'failed',

  finish = 'finish'
}

export enum ListGlobalDBServiceLastConnectionTestStatusEnum {
  connect_success = 'connect_success',

  connect_failed = 'connect_failed'
}

export enum ListGlobalDBServiceV2LastConnectionTestStatusEnum {
  connect_success = 'connect_success',

  connect_failed = 'connect_failed'
}

export enum ListMaskingRulesDataSourceEnum {
  builtin = 'builtin',

  custom = 'custom'
}

export enum ListMemberRoleWithOpRangeOpRangeTypeEnum {
  unknown = 'unknown',

  global = 'global',

  project = 'project',

  db_service = 'db_service'
}

export enum ListOpPermissionRangeTypeEnum {
  unknown = 'unknown',

  global = 'global',

  project = 'project',

  db_service = 'db_service'
}

export enum ListOpPermissionServiceEnum {
  dms = 'dms',

  sqle = 'sqle'
}

export enum ListProjectV1ProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum ListProjectV2ProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum ListRoleStatEnum {
  正常 = '正常',

  被禁用 = '被禁用',

  未知 = '未知',

  Normal = 'Normal',

  Disabled = 'Disabled',

  Unknown = 'Unknown'
}

export enum ListSensitiveDataDiscoveryTaskHistoriesDataStatusEnum {
  PENDING_CONFIRM = 'PENDING_CONFIRM',

  NORMAL = 'NORMAL',

  COMPLETED = 'COMPLETED',

  RUNNING = 'RUNNING',

  FAILED = 'FAILED',

  STOPPED = 'STOPPED'
}

export enum ListSensitiveDataDiscoveryTasksDataExecutionPlanEnum {
  PERIODIC = 'PERIODIC',

  ONE_TIME = 'ONE_TIME'
}

export enum ListSensitiveDataDiscoveryTasksDataIdentificationMethodEnum {
  BY_FIELD_NAME = 'BY_FIELD_NAME',

  BY_SAMPLE_DATA = 'BY_SAMPLE_DATA'
}

export enum ListSensitiveDataDiscoveryTasksDataStatusEnum {
  PENDING_CONFIRM = 'PENDING_CONFIRM',

  NORMAL = 'NORMAL',

  COMPLETED = 'COMPLETED',

  RUNNING = 'RUNNING',

  FAILED = 'FAILED',

  STOPPED = 'STOPPED'
}

export enum ListSensitiveDataDiscoveryTasksDataTaskTypeEnum {
  PERIODIC = 'PERIODIC',

  ONE_TIME = 'ONE_TIME'
}

export enum ListUserAuthenticationTypeEnum {
  ldap = 'ldap',

  dms = 'dms',

  oauth2 = 'oauth2',

  unknown = 'unknown'
}

export enum ListUserStatEnum {
  正常 = '正常',

  被禁用 = '被禁用',

  未知 = '未知',

  Normal = 'Normal',

  Disabled = 'Disabled',

  Unknown = 'Unknown'
}

export enum ListUserSystemEnum {
  WORKBENCH = 'WORKBENCH',

  MANAGEMENT = 'MANAGEMENT'
}

export enum ListUserGroupStatEnum {
  正常 = '正常',

  被禁用 = '被禁用',

  未知 = '未知',

  Normal = 'Normal',

  Disabled = 'Disabled',

  Unknown = 'Unknown'
}

export enum MaskingAlgorithmConfigMaskTypeEnum {
  CHAR = 'CHAR',

  TAG = 'TAG',

  REPLACE = 'REPLACE',

  ALGO = 'ALGO'
}

export enum MemberRoleWithOpRangeOpRangeTypeEnum {
  unknown = 'unknown',

  global = 'global',

  project = 'project',

  db_service = 'db_service'
}

export enum OpPermissionItemOpPermissionTypeEnum {
  unknown = 'unknown',

  create_project = 'create_project',

  global_view = 'global_view',

  global_management = 'global_management',

  project_admin = 'project_admin',

  create_workflow = 'create_workflow',

  audit_workflow = 'audit_workflow',

  auth_db_service_data = 'auth_db_service_data',

  view_others_workflow = 'view_others_workflow',

  execute_workflow = 'execute_workflow',

  view_other_audit_plan = 'view_other_audit_plan',

  view_sql_insight = 'view_sql_insight',

  save_audit_plan = 'save_audit_plan',

  sql_query = 'sql_query',

  create_export_task = 'create_export_task',

  audit_export_workflow = 'audit_export_workflow',

  create_optimization = 'create_optimization',

  view_others_optimization = 'view_others_optimization',

  create_pipeline = 'create_pipeline',

  view_operation_record = 'view_operation_record',

  view_export_task = 'view_export_task',

  view_quick_audit_record = 'view_quick_audit_record',

  view_ide_audit_record = 'view_ide_audit_record',

  view_optimization_record = 'view_optimization_record',

  view_version_manage = 'view_version_manage',

  version_manage = 'version_manage',

  view_pipeline = 'view_pipeline',

  manage_project_data_source = 'manage_project_data_source',

  manage_audit_rule_template = 'manage_audit_rule_template',

  manage_approval_template = 'manage_approval_template',

  manage_member = 'manage_member',

  manage_push_rule = 'manage_push_rule',

  manage_audit_sql_white_list = 'manage_audit_sql_white_list',

  manage_sql_mange_white_list = 'manage_sql_mange_white_list',

  manage_role_mange = 'manage_role_mange',

  desensitization = 'desensitization',

  masking_audit = 'masking_audit',

  none = 'none'
}

export enum OpPermissionItemRangeTypeEnum {
  unknown = 'unknown',

  global = 'global',

  project = 'project',

  db_service = 'db_service'
}

export enum OperationOperationTypeEnum {
  SQL = 'SQL'
}

export enum OperationRecordListItemStatusEnum {
  succeeded = 'succeeded',

  failed = 'failed'
}

export enum ProcessApprovalRequestReqActionEnum {
  APPROVE = 'APPROVE',

  REJECT = 'REJECT'
}

export enum ProjectInfoProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum ProjectV1ProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum ProjectV2ProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum {
  normal = 'normal',

  notice = 'notice',

  warn = 'warn',

  error = 'error'
}

export enum SensitiveFieldScanResultConfidenceEnum {
  HIGH = 'HIGH',

  MEDIUM = 'MEDIUM',

  LOW = 'LOW'
}

export enum SensitiveFieldScanResultRuleSourceEnum {
  builtin = 'builtin',

  custom = 'custom'
}

export enum SensitiveTypeDataSensitiveDataTypeSourceEnum {
  builtin = 'builtin',

  custom = 'custom'
}

export enum TableColumnMaskingDetailConfidenceEnum {
  HIGH = 'HIGH',

  MEDIUM = 'MEDIUM',

  LOW = 'LOW'
}

export enum TableColumnMaskingDetailMaskingRuleSourceEnum {
  builtin = 'builtin',

  custom = 'custom'
}

export enum TableColumnMaskingDetailStatusEnum {
  CONFIGURED = 'CONFIGURED',

  PENDING_CONFIRM = 'PENDING_CONFIRM',

  SYSTEM_CONFIRMED = 'SYSTEM_CONFIRMED'
}

export enum TestFeishuConfigurationAccountTypeEnum {
  email = 'email',

  phone = 'phone'
}

export enum UnmaskingOperationLogItemActionEnum {
  submit = 'submit',

  approve = 'approve',

  reject = 'reject',

  view_unmasking_workflow_detail = 'view_unmasking_workflow_detail',

  view_full_original_data = 'view_full_original_data',

  download_full_original_data = 'download_full_original_data',

  cancel = 'cancel',

  activate_view = 'activate_view'
}

export enum UnmaskingWorkflowDetailApprovalStatusEnum {
  pending = 'pending',

  approved = 'approved',

  rejected = 'rejected',

  cancelled = 'cancelled'
}

export enum UnmaskingWorkflowDetailSourceTypeEnum {
  data_export = 'data_export',

  sql_workbench = 'sql_workbench'
}

export enum UnmaskingWorkflowDetailUsageStatusEnum {
  unviewed = 'unviewed',

  viewed = 'viewed'
}

export enum UnmaskingWorkflowDetailViewStateEnum {
  not_activated = 'not_activated',

  active = 'active',

  view_expired = 'view_expired',

  activation_expired = 'activation_expired'
}

export enum UnmaskingWorkflowListItemApprovalStatusEnum {
  pending = 'pending',

  approved = 'approved',

  rejected = 'rejected',

  cancelled = 'cancelled'
}

export enum UnmaskingWorkflowListItemSourceTypeEnum {
  data_export = 'data_export',

  sql_workbench = 'sql_workbench'
}

export enum UnmaskingWorkflowListItemUsageStatusEnum {
  unviewed = 'unviewed',

  viewed = 'viewed'
}

export enum UnmaskingWorkflowListItemViewStateEnum {
  not_activated = 'not_activated',

  active = 'active',

  view_expired = 'view_expired',

  activation_expired = 'activation_expired'
}

export enum UpdateCurrentUserSystemEnum {
  WORKBENCH = 'WORKBENCH',

  MANAGEMENT = 'MANAGEMENT'
}

export enum UpdateProjectProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum UpdateProjectV2ProjectPriorityEnum {
  high = 'high',

  medium = 'medium',

  low = 'low',

  unknown = 'unknown'
}

export enum UpdateSensitiveDataDiscoveryTaskExecutionPlanEnum {
  PERIODIC = 'PERIODIC',

  ONE_TIME = 'ONE_TIME'
}

export enum UpdateSensitiveDataDiscoveryTaskIdentificationMethodEnum {
  BY_FIELD_NAME = 'BY_FIELD_NAME',

  BY_SAMPLE_DATA = 'BY_SAMPLE_DATA'
}

export enum UpdateSensitiveDataDiscoveryTaskReqActionEnum {
  ENABLE = 'ENABLE',

  TERMINATE = 'TERMINATE',

  UPDATE = 'UPDATE'
}

export enum UpdateUserSystemEnum {
  WORKBENCH = 'WORKBENCH',

  MANAGEMENT = 'MANAGEMENT'
}

export enum WorkflowRecordStatusEnum {
  wait_for_approve = 'wait_for_approve',

  wait_for_export = 'wait_for_export',

  exporting = 'exporting',

  rejected = 'rejected',

  cancel = 'cancel',

  failed = 'failed',

  finish = 'finish'
}

export enum WorkflowStepStateEnum {
  init = 'init',

  rejected = 'rejected',

  finish = 'finish'
}
