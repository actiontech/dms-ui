import {
  DMSProxyTargetScenarioEnum,
  GetDataExportTaskStatusEnum,
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum,
  ListDataExportWorkflowStatusEnum,
  ListMemberRoleWithOpRangeOpRangeTypeEnum,
  ListOpPermissionRangeTypeEnum,
  ListProjectProjectPriorityEnum,
  ListRoleStatEnum,
  ListUserAuthenticationTypeEnum,
  ListUserStatEnum,
  ListUserGroupStatEnum,
  MemberRoleWithOpRangeOpRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum,
  OperationOperationTypeEnum,
  ProjectProjectPriorityEnum,
  SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum,
  TestFeishuConfigurationAccountTypeEnum,
  UpdateProjectProjectPriorityEnum,
  WorkflowRecordStatusEnum,
  WorkflowStepStateEnum
} from './common.enum';

export interface IAccessTokenInfo {
  access_token?: string;

  is_expired?: boolean;

  token_expired_timestamp?: string;
}

export interface IAddDBServicePreCheckReply {
  code?: number;

  message?: string;
}

export interface IAddDBServiceReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddDBServiceReq {
  db_service?: IDBService;
}

export interface IAddDBServiceSyncTaskReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddDBServiceSyncTaskReq {
  db_service_sync_task?: IDBServiceSyncTask;
}

export interface IAddDataExportTaskReply {
  code?: number;

  data?: {
    data_export_task_uids?: string[];
  };

  message?: string;
}

export interface IAddDataExportTaskReq {
  data_export_tasks?: IDataExportTask[];
}

export interface IAddDataExportWorkflowReply {
  code?: number;

  data?: {
    export_data_workflow_uid?: string;
  };

  message?: string;
}

export interface IAddDataExportWorkflowReq {
  data_export_workflow?: IDataExportWorkflow;
}

export interface IAddMemberGroupReply {
  code?: number;

  data?: {
    id?: string;
  };

  message?: string;
}

export interface IAddMemberGroupReq {
  member_group?: IMemberGroup;
}

export interface IAddMemberReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddMemberReq {
  member?: IMember;
}

export interface IAddProjectReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddProjectReq {
  project?: IProject;
}

export interface IAddRoleReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddRoleReq {
  role?: IRole;
}

export interface IAddSession {
  password: string;

  username: string;
}

export interface IAddSessionReply {
  code?: number;

  data?: {
    token?: string;
  };

  message?: string;
}

export interface IAddSessionReq {
  session?: IAddSession;
}

export interface IAddUserGroupReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddUserGroupReq {
  user_group?: IUserGroup;
}

export interface IAddUserReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddUserReq {
  user?: IUser;
}

export interface IAdditionalParam {
  description?: string;

  name?: string;

  type?: string;

  value?: string;
}

export interface IAuditPlanTypes {
  audit_plan_id?: number;

  desc?: string;

  type?: string;
}

export interface IAuditSQLResult {
  db_type?: string;

  level?: string;

  message?: string;

  rule_name?: string;
}

export interface IAuditTaskResult {
  audit_level?: string;

  pass_rate?: number;

  score?: number;
}

export interface IBasicInfo {
  components?: IComponentNameWithVersion[];

  logo_url?: string;

  title?: string;
}

export interface IBatchGetDataExportTaskReply {
  code?: number;

  data?: IGetDataExportTask[];

  message?: string;
}

export interface IBindOauth2UserReply {
  code?: number;

  data?: IBindOauth2UserResData;

  message?: string;
}

export interface IBindOauth2UserReq {
  oauth2_token?: string;

  pwd?: string;

  user_name?: string;
}

export interface IBindOauth2UserResData {
  token?: string;
}

export interface IBusiness {
  id?: string;

  is_used?: boolean;

  name?: string;
}

export interface IBusinessForUpdate {
  id?: string;

  name?: string;
}

export interface ICBOperationLog {
  audit_result?: IAuditSQLResult[];

  db_service?: IUidWithDBServiceName;

  exec_result?: string;

  exec_time_second?: number;

  operation?: IOperation;

  operation_ip?: string;

  operation_person?: IUidWithName;

  operation_time?: string;

  result_set_row_count?: number;

  session_id?: string;

  uid?: string;
}

export interface ICBOperationLogTips {
  exec_result?: string[];
}

export interface ICancelDataExportWorkflowPayload {
  data_export_workflow_uids: string[];
}

export interface ICancelDataExportWorkflowReq {
  payload?: ICancelDataExportWorkflowPayload;
}

export interface ICheckDBServiceIsConnectableByIdReq {
  db_service_uid?: string;

  project_uid?: string;
}

export interface ICheckDBServiceIsConnectableReply {
  code?: number;

  data?: ICheckDBServiceIsConnectableReplyItem[];

  message?: string;
}

export interface ICheckDBServiceIsConnectableReplyItem {
  component?: string;

  connect_error_message?: string;

  is_connectable?: boolean;
}

export interface ICheckDBServiceIsConnectableReq {
  db_service?: ICheckDbConnectable;
}

export interface ICheckDbConnectable {
  additional_params?: IAdditionalParam[];

  db_type: string;

  host: string;

  password: string;

  port: string;

  user: string;
}

export interface ICheckDbsConnectable {
  additional_params?: IAdditionalParam[];

  db_type: string;

  host: string;

  name: string;

  password: string;

  port: string;

  user: string;
}

export interface ICheckLicenseReply {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface ICompanyNotice {
  notice_str?: string;

  read_by_current_user?: boolean;
}

export interface IComponentNameWithVersion {
  name?: string;

  version?: string;
}

export interface IDBService {
  additional_params?: IAdditionalParam[];

  business: string;

  db_type: string;

  desc?: string;

  host: string;

  is_enable_masking?: boolean;

  maintenance_times: IMaintenanceTime[];

  name: string;

  password: string;

  port: string;

  sqle_config?: ISQLEConfig;

  user: string;
}

export interface IDBServiceConnectionReq {
  db_services?: ICheckDbsConnectable[];
}

export interface IDBServiceSyncTask {
  additional_params?: IParams;

  cron_express: string;

  db_type: string;

  name: string;

  source: string;

  sqle_config?: ISQLEConfig;

  url: string;
}

export interface IDBServiceSyncTaskTip {
  db_type?: string[];

  description?: string;

  params?: IParams;

  service_source_name?: string;
}

export interface IDBServicesConnectionItem {
  failed_names?: string[];

  failed_num?: number;

  successful_num?: number;
}

export interface IDBServicesConnectionReply {
  code?: number;

  data?: IDBServicesConnectionItem;

  message?: string;
}

export interface IDMSProxyTarget {
  addr: string;

  name: string;

  proxy_url_prefixs: string[];

  scenario?: DMSProxyTargetScenarioEnum;

  version: string;
}

export interface IDataExportTask {
  database_name?: string;

  db_service_uid: string;

  export_sql?: string;
}

export interface IDataExportWorkflow {
  desc?: string;

  name: string;

  tasks: ITask[];
}

export interface IDatabaseDriverAdditionalParam {
  description?: string;

  name?: string;

  type?: string;

  value?: string;
}

export interface IDatabaseDriverOption {
  db_type?: string;

  logo_path?: string;

  params?: IDatabaseDriverAdditionalParam[];
}

export interface IDelDBServicePreCheckReply {
  code?: number;

  message?: string;
}

export interface IDelUserGroupPreCheckReply {
  code?: number;

  message?: string;
}

export interface IDelUserPreCheckReply {
  code?: number;

  message?: string;
}

export interface IFeishuConfigurationResData {
  app_id?: string;

  is_feishu_notification_enabled?: boolean;
}

export interface IFileHeader {
  Filename?: string;

  Header?: IMIMEHeader;

  Size?: number;
}

export interface IGenAccessToken {
  expiration_days?: string;
}

export interface IGenAccessTokenReply {
  code?: number;

  data?: IAccessTokenInfo;

  message?: string;
}

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IGetBasicInfoReply {
  code?: number;

  data?: IBasicInfo;

  message?: string;
}

export interface IGetCBOperationLogTipsReply {
  code?: number;

  data?: ICBOperationLogTips;

  message?: string;
}

export interface IGetCompanyNoticeReply {
  code?: number;

  data?: ICompanyNotice;

  message?: string;
}

export interface IGetDBServiceSyncTask {
  additional_params?: IParams;

  cron_express: string;

  db_type: string;

  name: string;

  source: string;

  sqle_config?: ISQLEConfig;

  uid?: string;

  url: string;
}

export interface IGetDBServiceSyncTaskReply {
  code?: number;

  data?: IGetDBServiceSyncTask;

  message?: string;
}

export interface IGetDataExportTask {
  audit_result?: IAuditTaskResult;

  db_info?: ITaskDBInfo;

  export_end_time?: string;

  export_file_type?: string;

  export_start_time?: string;

  export_type?: string;

  file_name?: string;

  status?: GetDataExportTaskStatusEnum;

  task_uid?: string;
}

export interface IGetDataExportWorkflow {
  create_time?: string;

  create_user?: IUidWithName;

  desc?: string;

  workflow_name?: string;

  workflow_record?: IWorkflowRecord;

  workflow_record_history?: IWorkflowRecord[];

  workflow_uid?: string;
}

export interface IGetDataExportWorkflowReply {
  code?: number;

  data?: IGetDataExportWorkflow;

  message?: string;
}

export interface IGetFeishuConfigurationReply {
  code?: number;

  data?: IFeishuConfigurationResData;

  message?: string;
}

export interface IGetLDAPConfigurationResDataReply {
  code?: number;

  data?: ILDAPConfigurationResData;

  message?: string;
}

export interface IGetLicenseReply {
  code?: number;

  content?: string;

  license?: ILicenseItem[];

  message?: string;
}

export interface IGetLicenseUsageReply {
  code?: number;

  data?: ILicenseUsage;

  message?: string;
}

export interface IGetMemberGroup {
  is_project_admin?: boolean;

  name?: string;

  role_with_op_ranges?: IListMemberRoleWithOpRange[];

  uid?: string;

  users?: IUidWithName[];
}

export interface IGetMemberGroupReply {
  code?: number;

  data?: IGetMemberGroup;

  message?: string;
}

export interface IGetOauth2ConfigurationResData {
  access_token_tag?: string;

  auto_create_user?: boolean;

  client_host?: string;

  client_id?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  skip_check_state?: boolean;

  user_email_tag?: string;

  user_id_tag?: string;

  user_wechat_tag?: string;
}

export interface IGetOauth2ConfigurationResDataReply {
  code?: number;

  data?: IGetOauth2ConfigurationResData;

  message?: string;
}

export interface IGetOauth2TipsReply {
  code?: number;

  data?: IGetOauth2TipsResData;

  message?: string;
}

export interface IGetOauth2TipsResData {
  enable_oauth2?: boolean;

  login_tip?: string;
}

export interface IGetProjectTipsReply {
  code?: number;

  data?: IProjectTips[];

  message?: string;
}

export interface IGetSMTPConfigurationReply {
  code?: number;

  data?: ISMTPConfigurationResData;

  message?: string;
}

export interface IGetSQLQueryConfigurationReply {
  code?: number;

  data?: {
    enable_sql_query?: boolean;

    sql_query_root_uri?: string;
  };

  message?: string;
}

export interface IGetUser {
  access_token_info?: IAccessTokenInfo;

  authentication_type?: GetUserAuthenticationTypeEnum;

  email?: string;

  is_admin?: boolean;

  language?: string;

  name?: string;

  op_permissions?: IUidWithName[];

  phone?: string;

  stat?: GetUserStatEnum;

  third_party_user_info?: string;

  uid?: string;

  user_bind_projects?: IUserBindProject[];

  user_groups?: IUidWithName[];

  wxid?: string;
}

export interface IGetUserBySessionReply {
  code?: number;

  data?: {
    name?: string;

    user_uid?: string;
  };

  message?: string;
}

export interface IGetUserOpPermissionReply {
  code?: number;

  data?: {
    is_admin?: boolean;

    op_permission_list?: IOpPermissionItem[];
  };

  message?: string;
}

export interface IGetUserReply {
  code?: number;

  data?: IGetUser;

  message?: string;
}

export interface IGetWeChatConfigurationReply {
  code?: number;

  data?: IWeChatConfigurationResData;

  message?: string;
}

export interface IGetWebHookConfigurationReply {
  code?: number;

  data?: IGetWebHookConfigurationReplyItem;

  message?: string;
}

export interface IGetWebHookConfigurationReplyItem {
  enable?: boolean;

  max_retry_times?: number;

  retry_interval_seconds?: number;

  token?: string;

  url?: string;
}

export interface II18nStr {
  [key: string]: string;
}

export interface IIPluginDBService {
  Business?: string;

  DBType?: string;

  Host?: string;

  Name?: string;

  Port?: string;

  SQLERuleTemplateId?: string;

  SQLERuleTemplateName?: string;

  User?: string;
}

export interface IImportDBService {
  additional_params?: IAdditionalParam[];

  business?: string;

  db_type?: string;

  desc?: string;

  host?: string;

  is_enable_masking?: boolean;

  maintenance_times?: IMaintenanceTime[];

  name?: string;

  password?: string;

  port?: string;

  project_uid?: string;

  source?: string;

  sqle_config?: ISQLEConfig;

  user?: string;
}

export interface IImportDBServicesCheckReply {
  code?: number;

  data?: IImportDBService[];

  message?: string;
}

export interface IImportDBServicesOfOneProjectReq {
  db_services?: IImportDBService[];
}

export interface IImportDBServicesOfProjectsReq {
  db_services?: IImportDBService[];
}

export interface IImportProjects {
  business?: string[];

  desc?: string;

  name?: string;
}

export interface IImportProjectsReq {
  projects?: IImportProjects[];
}

export interface ILDAPConfiguration {
  enable_ldap?: boolean;

  enable_ssl?: boolean;

  ldap_connect_dn?: string;

  ldap_connect_pwd?: string;

  ldap_search_base_dn?: string;

  ldap_server_host?: string;

  ldap_server_port?: string;

  ldap_user_email_rdn_key?: string;

  ldap_user_name_rdn_key?: string;
}

export interface ILDAPConfigurationResData {
  enable_ldap?: boolean;

  enable_ssl?: boolean;

  ldap_connect_dn?: string;

  ldap_search_base_dn?: string;

  ldap_server_host?: string;

  ldap_server_port?: string;

  ldap_user_email_rdn_key?: string;

  ldap_user_name_rdn_key?: string;
}

export interface ILicenseItem {
  description?: string;

  limit?: string;

  name?: string;
}

export interface ILicenseUsage {
  db_services_usage?: ILicenseUsageItem[];

  users_usage?: ILicenseUsageItem;
}

export interface ILicenseUsageItem {
  is_limited?: boolean;

  limit?: number;

  resource_type?: string;

  resource_type_desc?: string;

  used?: number;
}

export interface IListCBOperationLogsReply {
  audit_intercepted_sql_count?: number;

  code?: number;

  data?: ICBOperationLog[];

  exec_failed_sql_count?: number;

  exec_sql_total?: number;

  exec_success_rate?: number;

  message?: string;

  total_nums?: number;
}

export interface IListDBService {
  additional_params?: IAdditionalParam[];

  audit_plan_types?: IAuditPlanTypes[];

  business?: string;

  db_type?: string;

  desc?: string;

  host?: string;

  instance_audit_plan_id?: number;

  is_enable_masking?: boolean;

  maintenance_times?: IMaintenanceTime[];

  name?: string;

  password?: string;

  port?: string;

  project_uid?: string;

  source?: string;

  sqle_config?: ISQLEConfig;

  uid?: string;

  user?: string;
}

export interface IListDBServiceDriverOptionReply {
  code?: number;

  data?: IDatabaseDriverOption[];

  message?: string;
}

export interface IListDBServiceReply {
  code?: number;

  data?: IListDBService[];

  message?: string;

  total_nums?: number;
}

export interface IListDBServiceSyncTask {
  additional_params?: IParams;

  cron_express: string;

  db_type: string;

  last_sync_err?: string;

  last_sync_success_time?: string;

  name: string;

  source: string;

  sqle_config?: ISQLEConfig;

  uid?: string;

  url: string;
}

export interface IListDBServiceSyncTaskTipsReply {
  code?: number;

  data?: IDBServiceSyncTaskTip[];

  message?: string;
}

export interface IListDBServiceSyncTasksReply {
  code?: number;

  data?: IListDBServiceSyncTask[];

  message?: string;
}

export interface IListDBServiceTipItem {
  db_type?: string;

  host?: string;

  id?: string;

  name?: string;

  port?: string;
}

export interface IListDBServiceTipsReply {
  code?: number;

  data?: IListDBServiceTipItem[];

  message?: string;
}

export interface IListDataExportTaskSQL {
  audit_level?: string;

  audit_sql_result?: IAuditSQLResult[];

  export_result?: string;

  export_sql_type?: string;

  sql?: string;

  uid?: number;
}

export interface IListDataExportTaskSQLsReply {
  code?: number;

  data?: IListDataExportTaskSQL[];

  message?: string;

  total_nums?: number;
}

export interface IListDataExportWorkflow {
  created_at?: string;

  creater?: IUidWithName;

  current_step_assignee_user_list?: IUidWithName[];

  current_step_type?: string;

  desc?: string;

  exported_at?: string;

  project_uid?: string;

  status?: ListDataExportWorkflowStatusEnum;

  workflow_name?: string;

  workflow_uid?: string;
}

export interface IListDataExportWorkflowsReply {
  code?: number;

  data?: IListDataExportWorkflow[];

  message?: string;

  total_nums?: number;
}

export interface IListGlobalDBService {
  business?: string;

  db_type?: string;

  desc?: string;

  host?: string;

  is_enable_audit?: boolean;

  is_enable_masking?: boolean;

  maintenance_times?: IMaintenanceTime[];

  name?: string;

  port?: string;

  project_name?: string;

  project_uid?: string;

  source?: string;

  uid?: string;

  unfinished_workflow_num?: number;
}

export interface IListGlobalDBServiceTips {
  db_type?: string[];
}

export interface IListGlobalDBServicesReply {
  code?: number;

  data?: IListGlobalDBService[];

  message?: string;

  total_nums?: number;
}

export interface IListGlobalDBServicesTipsReply {
  code?: number;

  data?: IListGlobalDBServiceTips;

  message?: string;
}

export interface IListMaskingRulesData {
  description?: string;

  effect?: string;

  id?: number;

  masking_type?: string;

  reference_fields?: string[];
}

export interface IListMaskingRulesReply {
  code?: number;

  data?: IListMaskingRulesData[];

  message?: string;
}

export interface IListMember {
  is_project_admin?: boolean;

  role_with_op_ranges?: IListMemberRoleWithOpRange[];

  uid?: string;

  user?: IUidWithName;
}

export interface IListMemberGroup {
  is_project_admin?: boolean;

  name?: string;

  role_with_op_ranges?: IListMemberRoleWithOpRange[];

  uid?: string;

  users?: IUidWithName[];
}

export interface IListMemberGroupsReply {
  code?: number;

  data?: IListMemberGroup[];

  message?: string;

  total_nums?: number;
}

export interface IListMemberReply {
  code?: number;

  data?: IListMember[];

  message?: string;

  total_nums?: number;
}

export interface IListMemberRoleWithOpRange {
  op_range_type?: ListMemberRoleWithOpRangeOpRangeTypeEnum;

  range_uids?: IUidWithName[];

  role_uid?: IUidWithName;
}

export interface IListMemberTipsItem {
  user_id?: string;

  user_name?: string;
}

export interface IListMemberTipsReply {
  code?: number;

  data?: IListMemberTipsItem[];

  message?: string;
}

export interface IListMembersForInternalItem {
  is_admin?: boolean;

  member_op_permission_list?: IOpPermissionItem[];

  user?: IUidWithName;
}

export interface IListMembersForInternalReply {
  code?: number;

  data?: IListMembersForInternalItem[];

  message?: string;

  total_nums?: number;
}

export interface IListOpPermission {
  description?: string;

  op_permission?: IUidWithName;

  range_type?: ListOpPermissionRangeTypeEnum;
}

export interface IListOpPermissionReply {
  code?: number;

  data?: IListOpPermission[];

  message?: string;

  total_nums?: number;
}

export interface IListProject {
  archived?: boolean;

  business?: IBusiness[];

  create_time?: string;

  create_user?: IUidWithName;

  desc?: string;

  is_fixed_business?: boolean;

  name?: string;

  project_priority?: ListProjectProjectPriorityEnum;

  uid?: string;
}

export interface IListProjectReply {
  code?: number;

  data?: IListProject[];

  message?: string;

  total_nums?: number;
}

export interface IListRole {
  desc?: string;

  name?: string;

  op_permissions?: IUidWithName[];

  stat?: ListRoleStatEnum;

  uid?: string;
}

export interface IListRoleReply {
  code?: number;

  data?: IListRole[];

  message?: string;

  total_nums?: number;
}

export interface IListUser {
  authentication_type?: ListUserAuthenticationTypeEnum;

  email?: string;

  is_deleted?: boolean;

  name?: string;

  op_permissions?: IUidWithName[];

  phone?: string;

  stat?: ListUserStatEnum;

  third_party_user_info?: string;

  uid?: string;

  user_groups?: IUidWithName[];

  wxid?: string;
}

export interface IListUserGroup {
  desc?: string;

  name?: string;

  stat?: ListUserGroupStatEnum;

  uid?: string;

  users?: IUidWithName[];
}

export interface IListUserGroupReply {
  code?: number;

  data?: IListUserGroup[];

  message?: string;

  total_nums?: number;
}

export interface IListUserReply {
  code?: number;

  data?: IListUser[];

  message?: string;

  total_nums?: number;
}

export interface IMIMEHeader {
  [key: string]: any;
}

export interface IMaintenanceTime {
  maintenance_start_time?: ITime;

  maintenance_stop_time?: ITime;
}

export interface IMember {
  is_project_admin?: boolean;

  role_with_op_ranges?: IMemberRoleWithOpRange[];

  user_uid: string;
}

export interface IMemberGroup {
  is_project_admin?: boolean;

  name: string;

  role_with_op_ranges?: IMemberRoleWithOpRange[];

  user_uids: string[];
}

export interface IMemberRoleWithOpRange {
  op_range_type?: MemberRoleWithOpRangeOpRangeTypeEnum;

  range_uids?: string[];

  role_uid?: string;
}

export interface INotification {
  notification_body?: II18nStr;

  notification_subject?: II18nStr;

  user_uids?: string[];
}

export interface INotificationReply {
  code?: number;

  message?: string;
}

export interface IOauth2Configuration {
  access_token_tag?: string;

  auto_create_user?: boolean;

  client_host?: string;

  client_id?: string;

  client_key?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  skip_check_state?: boolean;

  user_email_tag?: string;

  user_id_tag?: string;

  user_wechat_tag?: string;
}

export interface IOauth2ConfigurationReq {
  oauth2?: IOauth2Configuration;
}

export interface IOpPermissionItem {
  op_permission_type?: OpPermissionItemOpPermissionTypeEnum;

  range_type?: OpPermissionItemRangeTypeEnum;

  range_uids?: string[];
}

export interface IOperateDataResourceHandleReply {
  code?: number;

  message?: string;
}

export interface IOperation {
  operation_detail?: string;

  operation_type?: OperationOperationTypeEnum;
}

export interface IParam {
  desc?: string;

  key?: string;

  type?: string;

  value?: string;
}

export type IParams = IParam[];

export interface IPersonalizationReq {
  file?: IFileHeader;

  title?: string;
}

export interface IPlugin {
  add_db_service_pre_check_url?: string;

  del_db_service_pre_check_url?: string;

  del_user_group_pre_check_url?: string;

  del_user_pre_check_url?: string;

  name?: string;

  operate_data_resource_handle_url?: string;
}

export interface IPreviewImportProjects {
  business?: string[];

  desc?: string;

  name?: string;
}

export interface IPreviewImportProjectsReply {
  code?: number;

  data?: IPreviewImportProjects[];

  message?: string;
}

export interface IProject {
  business?: string[];

  desc?: string;

  is_fixed_business?: boolean;

  name?: string;

  project_priority?: ProjectProjectPriorityEnum;
}

export interface IProjectTips {
  business?: string[];

  is_fixed_business?: boolean;
}

export interface IRegisterDMSPluginReply {
  code?: number;

  message?: string;
}

export interface IRegisterDMSPluginReq {
  plugin?: IPlugin;
}

export interface IRegisterDMSProxyTargetReply {
  code?: number;

  message?: string;
}

export interface IRegisterDMSProxyTargetReq {
  dms_proxy_target?: IDMSProxyTarget;
}

export interface IRejectDataExportWorkflowPayload {
  reason: string;
}

export interface IRejectDataExportWorkflowReq {
  payload?: IRejectDataExportWorkflowPayload;
}

export interface IRole {
  desc?: string;

  name: string;

  op_permission_uids?: string[];
}

export interface ISMTPConfigurationResData {
  enable_smtp_notify?: boolean;

  is_skip_verify?: boolean;

  smtp_host?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface ISQLEConfig {
  rule_template_id?: string;

  rule_template_name?: string;

  sql_query_config?: ISQLQueryConfig;
}

export interface ISQLQueryConfig {
  allow_query_when_less_than_audit_level?: SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum;

  audit_enabled?: boolean;

  max_pre_query_rows?: number;

  query_timeout_second?: number;
}

export interface ITask {
  task_uid?: string;
}

export interface ITaskDBInfo {
  database_name?: string;

  db_type?: string;

  name?: string;

  uid?: string;
}

export interface ITestFeishuConfiguration {
  account?: string;

  account_type?: TestFeishuConfigurationAccountTypeEnum;
}

export interface ITestFeishuConfigurationReply {
  code?: number;

  data?: ITestFeishuConfigurationResData;

  message?: string;
}

export interface ITestFeishuConfigurationReq {
  test_feishu_configuration?: ITestFeishuConfiguration;
}

export interface ITestFeishuConfigurationResData {
  error_message?: string;

  is_message_sent_normally?: boolean;
}

export interface ITestSMTPConfiguration {
  recipient_addr?: string;
}

export interface ITestSMTPConfigurationReply {
  code?: number;

  data?: ITestSMTPConfigurationResData;

  message?: string;
}

export interface ITestSMTPConfigurationReq {
  test_smtp_configuration?: ITestSMTPConfiguration;
}

export interface ITestSMTPConfigurationResData {
  is_smtp_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestWeChatConfiguration {
  recipient_id?: string;
}

export interface ITestWeChatConfigurationReply {
  code?: number;

  data?: ITestWeChatConfigurationResData;

  message?: string;
}

export interface ITestWeChatConfigurationReq {
  test_wechat_configuration?: ITestWeChatConfiguration;
}

export interface ITestWeChatConfigurationResData {
  is_wechat_send_normal?: boolean;

  send_error_message?: string;
}

export interface ITestWebHookConfigurationReply {
  code?: number;

  data?: ITestWebHookConfigurationResData;

  message?: string;
}

export interface ITestWebHookConfigurationResData {
  is_message_sent_normally?: boolean;

  send_error_message?: string;
}

export interface ITime {
  hour?: number;

  minute?: number;
}

export interface IUidWithDBServiceName {
  name?: string;

  uid?: string;
}

export interface IUidWithName {
  name?: string;

  uid?: string;
}

export interface IUpdateCompanyNotice {
  notice_str?: string;
}

export interface IUpdateCompanyNoticeReq {
  company_notice?: IUpdateCompanyNotice;
}

export interface IUpdateCurrentUser {
  email?: string;

  language?: string;

  old_password?: string;

  password?: string;

  phone?: string;

  wxid?: string;
}

export interface IUpdateCurrentUserReq {
  current_user?: IUpdateCurrentUser;
}

export interface IUpdateDBService {
  additional_params?: IAdditionalParam[];

  business: string;

  db_type: string;

  desc?: string;

  host: string;

  is_enable_masking?: boolean;

  maintenance_times: IMaintenanceTime[];

  password?: string;

  port: string;

  sqle_config?: ISQLEConfig;

  user: string;
}

export interface IUpdateDBServiceReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IUpdateDBServiceReq {
  db_service?: IUpdateDBService;
}

export interface IUpdateDBServiceSyncTaskReq {
  db_service_sync_task?: IDBServiceSyncTask;
}

export interface IUpdateFeishuConfiguration {
  app_id?: string;

  app_secret?: string;

  is_feishu_notification_enabled?: boolean;
}

export interface IUpdateFeishuConfigurationReq {
  update_feishu_configuration?: IUpdateFeishuConfiguration;
}

export interface IUpdateLDAPConfigurationReq {
  ldap?: ILDAPConfiguration;
}

export interface IUpdateMember {
  is_project_admin?: boolean;

  role_with_op_ranges?: IMemberRoleWithOpRange[];
}

export interface IUpdateMemberGroup {
  is_project_admin?: boolean;

  role_with_op_ranges?: IMemberRoleWithOpRange[];

  user_uids: string[];
}

export interface IUpdateMemberGroupReq {
  member_group?: IUpdateMemberGroup;
}

export interface IUpdateMemberReq {
  member?: IUpdateMember;
}

export interface IUpdateProject {
  business?: IBusinessForUpdate[];

  desc?: string;

  is_fixed_business?: boolean;

  project_priority?: UpdateProjectProjectPriorityEnum;
}

export interface IUpdateProjectReq {
  project?: IUpdateProject;
}

export interface IUpdateRole {
  desc?: string;

  is_disabled?: boolean;

  op_permission_uids?: string[];
}

export interface IUpdateRoleReq {
  role?: IUpdateRole;
}

export interface IUpdateSMTPConfiguration {
  enable_smtp_notify?: boolean;

  is_skip_verify?: boolean;

  smtp_host?: string;

  smtp_password?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface IUpdateSMTPConfigurationReq {
  smtp_configuration?: IUpdateSMTPConfiguration;
}

export interface IUpdateUser {
  email?: string;

  is_disabled?: boolean;

  language?: string;

  op_permission_uids?: string[];

  password?: string;

  phone?: string;

  user_group_uids?: string[];

  wxid?: string;
}

export interface IUpdateUserGroup {
  desc?: string;

  is_disabled?: boolean;

  user_uids?: string[];
}

export interface IUpdateUserGroupReq {
  user_group?: IUpdateUserGroup;
}

export interface IUpdateUserReq {
  user?: IUpdateUser;
}

export interface IUpdateWeChatConfiguration {
  agent_id?: number;

  corp_id?: string;

  corp_secret?: string;

  enable_wechat_notify?: boolean;

  proxy_ip?: string;

  safe_enabled?: boolean;
}

export interface IUpdateWeChatConfigurationReq {
  update_wechat_configuration?: IUpdateWeChatConfiguration;
}

export interface IUpdateWebHookConfigurationReq {
  webhook_config?: IWebHookConfigurationData;
}

export interface IUser {
  desc?: string;

  email?: string;

  name: string;

  op_permission_uids?: string[];

  password?: string;

  phone?: string;

  user_group_uids?: string[];

  wxid?: string;
}

export interface IUserBindProject {
  is_manager?: boolean;

  project_id?: string;

  project_name?: string;
}

export interface IUserGroup {
  desc?: string;

  name: string;

  user_uids?: string[];
}

export interface IUserOpPermission {
  project_uid?: string;
}

export interface IWeChatConfigurationResData {
  agent_id?: number;

  corp_id?: string;

  enable_wechat_notify?: boolean;

  proxy_ip?: string;

  safe_enabled?: boolean;
}

export interface IWebHookConfigurationData {
  enable?: boolean;

  max_retry_times?: number;

  retry_interval_seconds?: number;

  token?: string;

  url?: string;
}

export interface IWebHookSendMessageReply {
  code?: number;

  message?: string;
}

export interface IWebHookSendMessageReq {
  webhook_message?: IWebHooksMessage;
}

export interface IWebHooksMessage {
  message?: string;

  trigger_event_type?: string;
}

export interface IWorkflowRecord {
  current_step_number?: number;

  status?: WorkflowRecordStatusEnum;

  tasks?: ITask[];

  workflow_step_list?: IWorkflowStep[];
}

export interface IWorkflowStep {
  assignee_user_list?: IUidWithName[];

  desc?: string;

  number?: number;

  operation_time?: string;

  operation_user?: IUidWithName;

  reason?: string;

  state?: WorkflowStepStateEnum;

  type?: string;
}
