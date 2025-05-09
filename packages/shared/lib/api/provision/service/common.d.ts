import {
  AccountDetailPasswordExpirationPolicyEnum,
  AddDBAccountPasswordExpirationPolicyEnum,
  AddDataObjectSourceNameEnum,
  BatchUpdateDBAccountPasswordPasswordExpirationPolicyEnum,
  DMSProxyTargetScenarioEnum,
  DataObjectSourceNameEnum,
  DelDataObjectSourceDeleteModEnum,
  StatusEnum,
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum,
  ListDBAccountPasswordExpirationPolicyEnum,
  ListDBAccountStatusEnum,
  ListDBServiceLastConnectionTestStatusEnum,
  ListDBServiceV2LastConnectionTestStatusEnum,
  ListMemberRoleWithOpRangeOpRangeTypeEnum,
  ListProjectV1ProjectPriorityEnum,
  ListProjectV2ProjectPriorityEnum,
  ListServiceDbTypeEnum,
  ListServiceTypeEnum,
  ListUserAuthenticationTypeEnum,
  ListUserStatEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum,
  OperationScopeEnum,
  OperationInfoDataObjectTypesEnum,
  OperationInfoDbTypeEnum,
  PasswordConfigPasswordExpirationPolicyEnum,
  PlatformManagedPasswordExpirationPolicyEnum,
  SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum,
  ServiceDbTypeEnum,
  SyncRuleFieldNameEnum,
  SyncRuleRuleNameEnum
} from './common.enum';

export interface IAccessTokenInfo {
  access_token?: string;

  is_expired?: boolean;

  token_expired_timestamp?: string;
}

export interface IAccountDetail {
  additional_params?: IParams;

  address?: string;

  connect_string?: string;

  expired_time?: string;

  explanation?: string;

  password?: string;

  password_create_time?: string;

  password_expiration_policy?: AccountDetailPasswordExpirationPolicyEnum;

  user?: string;
}

export interface IAccountInfo {
  hostname?: string;

  password?: string;

  user?: string;
}

export interface IAccountStatics {
  lock_account_num?: number;

  nearing_expiration_account_num?: number;

  total_account_num?: number;

  unlock_account_num?: number;
}

export interface IAddDBAccount {
  data_permissions?: IDataPermission[];

  db_account: IDBAccount;

  db_roles?: string[];

  db_service_uid: string;

  effective_time_day?: number;

  explanation?: string;

  password_expiration_policy: AddDBAccountPasswordExpirationPolicyEnum;
}

export interface IAddDBAccountReply {
  code?: number;

  data?: {
    db_account_uid?: string;
  };

  message?: string;
}

export interface IAddDBRole {
  data_permissions?: IDataPermission[];

  db_role_uids?: string[];

  name: string;
}

export interface IAddDBRoleReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddDataObjectSource {
  address: string;

  name: AddDataObjectSourceNameEnum;

  sync_cron: string;

  sync_rules: ISyncRule[];

  version: string;
}

export interface IAddDataObjectSourceReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddDataPermissionTemplate {
  data_permissions?: IDataPermission[];

  memo?: string;

  name: string;

  namespace_uid: string;
}

export interface IAddDataPermissionTemplateReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddServiceReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
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

export interface IAuthGetAccountStaticsReply {
  code?: number;

  data?: IAccountStatics;

  message?: string;
}

export interface IAuthUserGroups {
  auth_users?: IUidWithName[];

  name?: string;

  uid?: string;
}

export interface IBatchUpdateDBAccountPassword {
  password_expiration_policy?: BatchUpdateDBAccountPasswordPasswordExpirationPolicyEnum;

  passwords?: IBatchUpdatePassword[];

  renewal_effective_time_day?: number;
}

export interface IBatchUpdatePassword {
  db_account_password?: string;

  db_account_uid?: string;
}

export interface IBusiness {
  id?: string;

  is_used?: boolean;

  name?: string;
}

export interface IBusinessTagCommon {
  name?: string;

  uid?: string;
}

export interface ICopyDataPermissionTemplate {
  name: string;
}

export interface ICopyDataPermissionTemplateReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IDBAccount {
  additional_params?: IParams;

  explanation?: string;

  password: string;

  username: string;
}

export interface IDBAccountBody {
  additional_param?: IParams;

  db_roles?: IUidWithName[];

  permission_info?: IPermissionInfo;

  user?: string;
}

export interface IDBAccountDataPermission {
  data_objects?: IDataObjectInDataPermission[];

  data_operations?: IDataOperationInDataPermission[];

  data_permission_different?: IDataPermissionDifferent;
}

export interface IDBAccountMeta {
  desc?: string;

  enums_value?: IEnumsValue[];

  key?: string;

  type?: string;

  value?: string;
}

export interface IDBRoleDatePermissions {
  DBAccountDataPermission?: IDBAccountDataPermission[];

  name?: string;

  uid?: string;
}

export interface IDBRoleDetail {
  child_roles?: IUidWithName[];

  data_permissions?: IDataPermissionDetail[];

  db_role?: IUidWithName;
}

export interface IDBRoleDetailReply {
  code?: number;

  data?: IDBRoleDetail;

  message?: string;
}

export interface IDMSProxyTarget {
  addr: string;

  name: string;

  proxy_url_prefixs: string[];

  scenario?: DMSProxyTargetScenarioEnum;

  version: string;
}

export interface IDataObjectInDataPermission {
  database_uid?: string;

  name?: string;

  table_uid?: string;
}

export interface IDataObjectSource {
  address?: string;

  last_sync_error?: string;

  name?: DataObjectSourceNameEnum;

  sync_cron?: string;

  sync_rules?: ISyncRule[];

  uid?: string;

  version?: string;
}

export interface IDataOperationInDataPermission {
  name?: string;

  uid?: string;
}

export interface IDataOperationSet {
  name?: string;

  operations?: IOperationInfo[];

  uid?: string;
}

export interface IDataPermission {
  data_object_uids: string[];

  data_operation_uids: string[];
}

export interface IDataPermissionDetail {
  data_objects?: IDataObjectInDataPermission[];

  data_operations?: IDataOperationInDataPermission[];
}

export interface IDataPermissionDifferent {
  original_data_permission?: string;
}

export interface IDataPermissionTemplateReply {
  name?: string;

  uid?: string;
}

export interface IDatabase {
  name?: string;

  uid?: string;
}

export interface IDatabaseDriverOptions {
  db_type?: string;

  params?: IAdditionalParam[];
}

export interface IDatabaseDriverOptionsReply {
  code?: number;

  data?: IDatabaseDriverOptions[];

  message?: string;
}

export interface IDelDataObjectSource {
  delete_mod: DelDataObjectSourceDeleteModEnum;
}

export interface IDiscoveryDBAccountReply {
  code?: number;

  data?: {
    accounts?: IDBAccountBody[];
  };

  message?: string;
}

export interface IEnumsValue {
  desc?: string;

  value?: string;
}

export interface IEnvironmentTag {
  name?: string;

  uid?: string;
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

export interface IGetDBAccountMetaReply {
  code?: number;

  data?: {
    db_account_metas?: IDBAccountMeta[];
  };

  message?: string;
}

export interface IGetDBAccountReply {
  code?: number;

  data?: {
    account_info?: IAccountDetail;

    auth_group_users?: IAuthUserGroups[];

    auth_users?: string[];

    data_permissions?: IDBAccountDataPermission[];

    db_account_uid?: string;

    db_roles?: IDBRoleDatePermissions[];

    db_service?: IUidWithName;

    password_managed?: boolean;

    status?: StatusEnum;
  };

  message?: string;
}

export interface IGetDataPermissionsInDataPermissionTemplate {
  business?: string;

  data_objects?: IDataObjectInDataPermission[];

  data_operation_sets?: IDataOperationInDataPermission[];

  environment_tag?: string;

  service_name?: string;

  service_uid?: string;
}

export interface IGetDataPermissionsInDataPermissionTemplateReply {
  code?: number;

  data?: IGetDataPermissionsInDataPermissionTemplate[];

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

export interface IGetStatement {
  data_permissions?: IDataPermission[];

  db_accounts?: IDBAccount[];

  db_roles?: string[];

  db_service_uid?: string;
}

export interface IGetStatementsByDataPermissionTemplateReply {
  code?: number;

  data?: IStatement[];

  message?: string;
}

export interface IGetStatementsReply {
  code?: number;

  data?: IStatement[];

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

  two_factor_enabled?: boolean;

  uid?: string;

  user_bind_projects?: IUserBindProject[];

  user_groups?: IUidWithName[];

  wxid?: string;
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

export interface IGetUsersFromDBServiceReply {
  code?: number;

  data?: IUserInfo[];

  message?: string;
}

export interface II18nStr {
  [key: string]: string;
}

export interface IListAuthorizationEvent {
  data_permission_templates?: IDataPermissionTemplateReply[];

  db_account_explanation?: string;

  db_account_hostname?: string;

  db_account_name?: string;

  event_type?: string;

  event_uid?: string;

  executing_user_name?: string;

  executing_user_uid?: string;

  generated_time?: string;

  memo?: string;

  permission_user_name?: string;

  permission_user_uid?: string;

  purpose?: string;
}

export interface IListAuthorizationEventsReply {
  code?: number;

  data?: IListAuthorizationEvent[];

  message?: string;

  total_nums?: number;
}

export interface IListDBAccount {
  account_info?: IAccountInfo;

  auth_user_groups?: IAuthUserGroups[];

  auth_users?: IUidWithName[];

  db_account_uid?: string;

  db_service?: IUidWithName;

  expired_time?: string;

  explanation?: string;

  password_expiration_policy?: ListDBAccountPasswordExpirationPolicyEnum;

  password_expired?: boolean;

  platform_managed?: boolean;

  remaining_days?: string;

  status?: ListDBAccountStatusEnum;
}

export interface IListDBAccountReply {
  code?: number;

  data?: IListDBAccount[];

  message?: string;

  total_nums?: number;
}

export interface IListDBRole {
  child_roles?: IUidWithName[];

  create_user?: IUidWithName;

  data_permissions?: string[];

  db_role?: IUidWithName;
}

export interface IListDBRoleReply {
  code?: number;

  data?: IListDBRole[];

  message?: string;

  total_nums?: number;
}

export interface IListDBRoleTips {
  db_role?: IUidWithName;
}

export interface IListDBRoleTipsReply {
  code?: number;

  data?: IListDBRoleTips[];

  message?: string;
}

export interface IListDBService {
  additional_params?: IAdditionalParam[];

  audit_plan_types?: IAuditPlanTypes[];

  backup_max_rows?: number;

  business?: string;

  db_type?: string;

  desc?: string;

  enable_backup?: boolean;

  host?: string;

  instance_audit_plan_id?: number;

  is_enable_masking?: boolean;

  last_connection_test_error_message?: string;

  last_connection_test_status?: ListDBServiceLastConnectionTestStatusEnum;

  last_connection_test_time?: string;

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

export interface IListDBServiceReply {
  code?: number;

  data?: IListDBService[];

  message?: string;

  total_nums?: number;
}

export interface IListDBServiceReplyV2 {
  code?: number;

  data?: IListDBServiceV2[];

  message?: string;

  total_nums?: number;
}

export interface IListDBServiceV2 {
  additional_params?: IAdditionalParam[];

  audit_plan_types?: IAuditPlanTypes[];

  backup_max_rows?: number;

  db_type?: string;

  desc?: string;

  enable_backup?: boolean;

  environment_tag?: IEnvironmentTag;

  host?: string;

  instance_audit_plan_id?: number;

  is_enable_masking?: boolean;

  last_connection_test_error_message?: string;

  last_connection_test_status?: ListDBServiceV2LastConnectionTestStatusEnum;

  last_connection_test_time?: string;

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

export interface IListDataObjectServiceEvent {
  business?: string;

  data_object_service_name?: string;

  environment_tag?: string;

  event_uid?: string;

  generated_time?: string;

  operation?: string;
}

export interface IListDataObjectServiceEventsReply {
  code?: number;

  data?: IListDataObjectServiceEvent[];

  message?: string;

  total_nums?: number;
}

export interface IListDataObjectSourcesReply {
  code?: number;

  data?: IDataObjectSource[];

  message?: string;

  total_nums?: number;
}

export interface IListDataOperationSetsReply {
  code?: number;

  data?: IDataOperationSet[];

  message?: string;

  total_nums?: number;
}

export interface IListDataPermissionInTemplate {
  data_object_service_name?: string;

  data_objects?: string[];

  data_operations?: string[];
}

export interface IListDataPermissionTemplate {
  authorization_purpose?: string[];

  create_user?: string;

  created_at?: string;

  memo?: string;

  name?: string;

  namespace_uid?: string;

  uid?: string;
}

export interface IListDataPermissionTemplateEvent {
  data_permission_template_name?: string;

  data_permission_template_uid?: string;

  data_permissions?: IListDataPermissionInTemplate[];

  event_type?: string;

  event_uid?: string;

  executing_user_name?: string;

  executing_user_uid?: string;

  generated_time?: string;
}

export interface IListDataPermissionTemplateEventsReply {
  code?: number;

  data?: IListDataPermissionTemplateEvent[];

  message?: string;

  total_nums?: number;
}

export interface IListDataPermissionTemplateReply {
  code?: number;

  data?: IListDataPermissionTemplate[];

  message?: string;

  total_nums?: number;
}

export interface IListDatabaseReply {
  code?: number;

  data?: IDatabase[];

  message?: string;

  total_nums?: number;
}

export interface IListEnvironmentTagsFromDBServiceReply {
  code?: number;

  data?: {
    environment_tags?: IEnvironmentTag[];
  };

  message?: string;
}

export interface IListInternalUser {
  name?: string;

  user_uid?: string;
}

export interface IListInternalUserReply {
  code?: number;

  data?: IListInternalUser[];

  message?: string;

  total_nums?: number;
}

export interface IListMemberRoleWithOpRange {
  op_range_type?: ListMemberRoleWithOpRangeOpRangeTypeEnum;

  range_uids?: IUidWithName[];

  role_uid?: IUidWithName;
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

export interface IListOperationsReply {
  code?: number;

  data?: IOperation[];

  message?: string;

  total_nums?: number;
}

export interface IListProjectReply {
  code?: number;

  data?: IListProjectV1[];

  message?: string;

  total_nums?: number;
}

export interface IListProjectReplyV2 {
  code?: number;

  data?: IListProjectV2[];

  message?: string;

  total_nums?: number;
}

export interface IListProjectV1 {
  archived?: boolean;

  business?: IBusiness[];

  create_time?: string;

  create_user?: IUidWithName;

  desc?: string;

  is_fixed_business?: boolean;

  name?: string;

  project_priority?: ListProjectV1ProjectPriorityEnum;

  uid?: string;
}

export interface IListProjectV2 {
  archived?: boolean;

  business_tag?: IBusinessTagCommon;

  create_time?: string;

  create_user?: IUidWithName;

  desc?: string;

  name?: string;

  project_priority?: ListProjectV2ProjectPriorityEnum;

  uid?: string;
}

export interface IListService {
  address?: string;

  db_type?: ListServiceDbTypeEnum;

  environment_tag?: IEnvironmentTag;

  last_sync_data_result?: string;

  last_sync_data_time?: string;

  name?: string;

  type?: ListServiceTypeEnum;

  uid?: string;

  user?: string;
}

export interface IListServiceReply {
  code?: number;

  data?: IListService[];

  message?: string;

  total_nums?: number;
}

export interface IListTableReply {
  code?: number;

  data?: ITable[];

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

export interface IListUserReply {
  code?: number;

  data?: IListUser[];

  message?: string;

  total_nums?: number;
}

export interface IMaintenanceTime {
  maintenance_start_time?: ITime;

  maintenance_stop_time?: ITime;
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
  name?: string;

  scope?: OperationScopeEnum[];

  uid?: string;
}

export interface IOperationInfo {
  data_object_types?: OperationInfoDataObjectTypesEnum[];

  data_operations?: IOperation[];

  db_type?: OperationInfoDbTypeEnum;
}

export interface IParam {
  desc?: string;

  key?: string;

  type?: string;

  value?: string;
}

export type IParams = IParam[];

export interface IPasswordConfig {
  db_account_password?: string;

  password_expiration_policy?: PasswordConfigPasswordExpirationPolicyEnum;

  password_expired_day?: number;
}

export interface IPermissionInfo {
  grants?: string[];
}

export interface IPermissionUserGroups {
  permission_user_group_uids?: string[];
}

export interface IPermissionUsers {
  permission_user_uids?: string[];
}

export interface IPlatformManaged {
  manage_password?: string;

  password_expiration_policy?: PlatformManagedPasswordExpirationPolicyEnum;

  password_expired_day?: number;

  platform_managed?: boolean;
}

export interface IPlugin {
  get_database_driver_logos_url?: string;

  get_database_driver_options_url?: string;

  name?: string;

  operate_data_resource_handle_url?: string;
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

export interface IService {
  address: string;

  business: string;

  db_type: ServiceDbTypeEnum;

  environment_tag: string;

  name: string;

  password: string;

  user: string;
}

export interface IStatement {
  comment?: string;

  create_statement?: string;

  grant_statements?: string[];
}

export interface ISyncRule {
  expression?: string;

  field_name?: SyncRuleFieldNameEnum;

  rule_name?: SyncRuleRuleNameEnum;
}

export interface ITable {
  name?: string;

  uid?: string;
}

export interface ITime {
  hour?: number;

  minute?: number;
}

export interface IUidWithName {
  name?: string;

  uid?: string;
}

export interface IUpdateDBAccount {
  data_permissions?: IDataPermission[];

  db_roles?: string[];

  explanation?: string;

  lock?: boolean;

  password_config?: IPasswordConfig;

  permission_user_groups?: IPermissionUserGroups;

  permission_users?: IPermissionUsers;

  platform_managed?: IPlatformManaged;

  renewal_effective_time_day?: number;
}

export interface IUpdateDBRole {
  child_roles?: string[];

  data_permissions?: IDataPermission[];
}

export interface IUpdateDBRoleReply {
  code?: number;

  message?: string;
}

export interface IUpdateDataObjectSource {
  address: string;

  sync_cron: string;

  sync_rules: ISyncRule[];

  version: string;
}

export interface IUpdateDataPermissionTemplate {
  data_permissions?: IDataPermission[];
}

export interface IUpdateDataPermissionTemplateReply {
  code?: number;

  message?: string;
}

export interface IUpdateService {
  address: string;

  name: string;

  password: string;

  user: string;
}

export interface IUserBindProject {
  is_manager?: boolean;

  project_id?: string;

  project_name?: string;
}

export interface IUserInfo {
  host?: string;

  privileges?: string[];

  user?: string;
}

export interface IUserOpPermission {
  project_uid?: string;
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
