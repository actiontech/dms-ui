import {
  AddDataObjectSourceNameEnum,
  DMSProxyTargetScenarioEnum,
  DataObjectSourceNameEnum,
  DelDataObjectSourceDeleteModEnum,
  StatusEnum,
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum,
  ListAuthorizationStatusEnum,
  ListDBAccountStatusEnum,
  ListServiceDbTypeEnum,
  ListServiceTypeEnum,
  ListUserAuthenticationTypeEnum,
  ListUserStatEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum,
  OperationInfoDataObjectTypesEnum,
  OperationInfoDbTypeEnum,
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
  address?: string;

  connect_string?: string;

  expired_time?: string;

  explanation?: string;

  hostname?: string;

  password?: string;

  password_create_time?: string;

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

export interface IAddAuthorization {
  data_permission_template_uid: string;

  db_account: IDBAccount;

  effective_time_day?: number;

  memo?: string;

  permission_user_uid: string;

  purpose: string;
}

export interface IAddAuthorizationReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddDBAccount {
  data_permissions?: IDataPermission[];

  db_account: IDBAccount;

  db_service_uid: string;

  effective_time_day?: number;

  explanation?: string;

  password_security_policy?: string;
}

export interface IAddDBAccountReply {
  code?: number;

  data?: {
    db_account_uid?: string;
  };

  message?: string;
}

export interface IAddDBServicePreCheckReply {
  code?: number;

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

export interface IAddPasswordSecurityPolicy {
  name: string;

  password_expiration_period: number;
}

export interface IAddPasswordSecurityPolicyReply {
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

export interface IAuthGetAccountStaticsReply {
  code?: number;

  data?: IAccountStatics;

  message?: string;
}

export interface IBatchUpdateDBAccountPassword {
  password_security_policy?: string;

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
  explanation?: string;

  hostname: string;

  password: string;

  username: string;
}

export interface IDBAccountBody {
  hostname?: string;

  permission_info?: IPermissionInfo;

  user?: string;
}

export interface IDBAccountDataPermission {
  data_objects?: IDataObjectInDataPermission[];

  data_operation_sets?: IDataOperationSetInDataPermission[];

  data_permission_different?: IDataPermissionDifferent;
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

export interface IDataObjectService {
  data_object_service_dns?: string;

  data_object_service_uid?: string;

  data_object_service_user?: string;
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

export interface IDataOperationSet {
  name?: string;

  operations?: IOperationInfo[];

  uid?: string;
}

export interface IDataOperationSetInDataPermission {
  name?: string;

  uid?: string;
}

export interface IDataPermission {
  data_object_uids: string[];

  data_operation_set_uids: string[];
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

export interface IDelDBServicePreCheckReply {
  code?: number;

  message?: string;
}

export interface IDelDataObjectSource {
  delete_mod: DelDataObjectSourceDeleteModEnum;
}

export interface IDelUserGroupPreCheckReply {
  code?: number;

  message?: string;
}

export interface IDelUserPreCheckReply {
  code?: number;

  message?: string;
}

export interface IDiscoveryDBAccountReply {
  code?: number;

  data?: {
    accounts?: IDBAccountBody[];
  };

  message?: string;
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

export interface IGetAuthorizationReply {
  code?: number;

  data?: {
    businesses?: string;

    data_permissions?: IGetDataPermissionsInDataPermissionTemplate[];

    db_accounts?: IListDBAccountByAuth[];

    memo?: string;

    permission_user?: string;

    purpose?: string;
  };

  message?: string;
}

export interface IGetDBAccountReply {
  code?: number;

  data?: {
    account_info?: IAccountDetail;

    auth_users?: string[];

    data_permissions?: IDBAccountDataPermission[];

    db_account_uid?: string;

    db_service?: IUidWithName;

    password_managed?: boolean;

    password_security_policy?: string;

    status?: StatusEnum;
  };

  message?: string;
}

export interface IGetDataPermissionsInDataPermissionTemplate {
  business?: string;

  data_objects?: IDataObjectInDataPermission[];

  data_operation_sets?: IDataOperationSetInDataPermission[];

  service_name?: string;

  service_uid?: string;
}

export interface IGetDataPermissionsInDataPermissionTemplateReply {
  code?: number;

  data?: IGetDataPermissionsInDataPermissionTemplate[];

  message?: string;
}

export interface IGetStatement {
  data_permissions?: IDataPermission[];

  db_accounts?: IDBAccount[];

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

export interface IListAuthorization {
  businesses?: string;

  data_object_service?: IDataObjectService[];

  data_permission_template_names?: string[];

  expiration?: number;

  last_update_at?: string;

  memo?: string;

  permission_user?: string;

  purpose?: string;

  status?: ListAuthorizationStatusEnum;

  uid?: string;
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

export interface IListAuthorizationReply {
  code?: number;

  data?: IListAuthorization[];

  message?: string;

  total_nums?: number;
}

export interface IListBusinessFromDBServiceReply {
  code?: number;

  data?: {
    businesses?: string[];
  };

  message?: string;
}

export interface IListDBAccount {
  account_info?: IAccountInfo;

  auth_users?: IUidWithName[];

  db_account_uid?: string;

  db_service?: IUidWithName;

  expired_time?: string;

  explanation?: string;

  password_security_policy?: string;

  platform_managed?: boolean;

  remaining_days?: string;

  status?: ListDBAccountStatusEnum;
}

export interface IListDBAccountByAuth {
  connection_cmd?: string;

  data_object_service_dns?: string;

  explanation?: string;

  hostname?: string;

  password?: string;

  uid?: string;

  user?: string;
}

export interface IListDBAccountByAuthReply {
  code?: number;

  data?: IListDBAccountByAuth[];

  message?: string;

  total_nums?: number;
}

export interface IListDBAccountReply {
  code?: number;

  data?: IListDBAccount[];

  message?: string;

  total_nums?: number;
}

export interface IListDBService {
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

  uid?: string;

  user?: string;
}

export interface IListDBServiceReply {
  code?: number;

  data?: IListDBService[];

  message?: string;

  total_nums?: number;
}

export interface IListDataObjectServiceEvent {
  business?: string;

  data_object_service_name?: string;

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

export interface IListPasswordSecurityPolicysReply {
  code?: number;

  data?: IPasswordSecurityPolicy[];

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

  uid?: string;
}

export interface IListProjectReply {
  code?: number;

  data?: IListProject[];

  message?: string;

  total_nums?: number;
}

export interface IListService {
  address?: string;

  business?: string;

  db_type?: ListServiceDbTypeEnum;

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

export interface IListTipsByAuthorizationKeyReply {
  code?: number;

  data?: {
    tips?: string[];
  };

  message?: string;
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
  notification_body?: string;

  notification_subject?: string;

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

  uid?: string;
}

export interface IOperationInfo {
  data_object_types?: string[];

  data_operations?: IOperation[];

  db_type?: OperationInfoDbTypeEnum;
}

export interface IPasswordConfig {
  db_account_password?: string;

  password_expired_day?: number;

  password_security_policy?: string;
}

export interface IPasswordSecurityPolicy {
  is_default?: boolean;

  name?: string;

  password_expiration_period?: number;

  uid?: string;
}

export interface IPermissionInfo {
  grants?: string[];
}

export interface IPermissionUsers {
  permission_user_uids?: string[];
}

export interface IPlatformManaged {
  manage_password?: string;

  password_expired_day?: number;

  password_security_policy?: string;

  platform_managed?: boolean;
}

export interface IPlugin {
  add_db_service_pre_check_url?: string;

  del_db_service_pre_check_url?: string;

  del_user_group_pre_check_url?: string;

  del_user_pre_check_url?: string;

  name?: string;

  operate_data_resource_handle_url?: string;
}

export interface IRegisterDMSPluginReply {
  code?: number;

  message?: string;
}

export interface IRegisterDMSProxyTargetReply {
  code?: number;

  message?: string;
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

export interface IUpdateAuthorization {
  data_permission_template_uid?: string;

  renewal_effective_time_day?: number;

  update_authorization_user?: IUpdateAuthorizationUser;
}

export interface IUpdateAuthorizationUser {
  db_account_password?: string;

  permission_user_uid?: string;
}

export interface IUpdateDBAccount {
  data_permissions?: IDataPermission[];

  explanation?: string;

  lock?: boolean;

  password_config?: IPasswordConfig;

  permission_users?: IPermissionUsers;

  platform_managed?: IPlatformManaged;

  renewal_effective_time_day?: number;
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

export interface IUpdatePasswordSecurityPolicy {
  name?: string;

  password_expiration_period?: number;
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

export interface IWebHooksMessage {
  message?: string;

  trigger_event_type?: string;
}
