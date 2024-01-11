import {
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum,
  ListMemberRoleWithOpRangeOpRangeTypeEnum,
  ListOpPermissionRangeTypeEnum,
  ListRoleStatEnum,
  ListUserAuthenticationTypeEnum,
  ListUserStatEnum,
  ListUserGroupStatEnum,
  MemberRoleWithOpRangeOpRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum,
  SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum,
  TestFeishuConfigurationAccountTypeEnum
} from './common.enum';

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

export interface IAddDatabaseSourceServiceReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddMemberGroupReply {
  code?: number;

  data?: {
    id?: string;
  };

  message?: string;
}

export interface IAddMemberReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddProjectReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddRoleReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
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

export interface IAddUserGroupReply {
  code?: number;

  data?: {
    uid?: string;
  };

  message?: string;
}

export interface IAddUserReply {
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

export interface IBasicInfo {
  components?: IComponentNameWithVersion[];

  logo_url?: string;

  title?: string;
}

export interface IBindOauth2UserReply {
  code?: number;

  data?: IBindOauth2UserResData;

  message?: string;
}

export interface IBindOauth2UserResData {
  token?: string;
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

export interface ICheckDbConnectable {
  additional_params?: IAdditionalParam[];

  db_type: string;

  host: string;

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

  maintenance_times: IMaintenanceTime[];

  name: string;

  password: string;

  port: string;

  sqle_config?: ISQLEConfig;

  user: string;
}

export interface IDMSProxyTarget {
  addr: string;

  name: string;

  proxy_url_prefixs: string[];

  version: string;
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

export interface IDatabaseSource {
  db_types?: string[];

  source?: string;
}

export interface IDatabaseSourceService {
  cron_express: string;

  db_type: string;

  name: string;

  source: string;

  sqle_config?: ISQLEConfig;

  url: string;

  version: string;
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

export interface IGenericResp {
  code?: number;

  message?: string;
}

export interface IGetBasicInfoReply {
  code?: number;

  data?: IBasicInfo;

  message?: string;
}

export interface IGetCompanyNoticeReply {
  code?: number;

  data?: ICompanyNotice;

  message?: string;
}

export interface IGetDatabaseSourceService {
  cron_express: string;

  db_type: string;

  name: string;

  project_uid?: string;

  source: string;

  sqle_config?: ISQLEConfig;

  uid?: string;

  url: string;

  version: string;
}

export interface IGetDatabaseSourceServiceReply {
  code?: number;

  data?: IGetDatabaseSourceService;

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

  client_host?: string;

  client_id?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  user_id_tag?: string;

  user_email_tag?: string;

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
  authentication_type?: GetUserAuthenticationTypeEnum;

  email?: string;

  is_admin?: boolean;

  name?: string;

  op_permissions?: IUidWithName[];

  phone?: string;

  stat?: GetUserStatEnum;

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

export interface IListDBService {
  additional_params?: IAdditionalParam[];

  business?: string;

  db_type?: string;

  desc?: string;

  host?: string;

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

export interface IListDatabaseSourceService {
  cron_express: string;

  db_type: string;

  last_sync_err?: string;

  last_sync_success_time?: string;

  name: string;

  project_uid?: string;

  source: string;

  sqle_config?: ISQLEConfig;

  uid?: string;

  url: string;

  version: string;
}

export interface IListDatabaseSourceServiceTipsReply {
  code?: number;

  data?: IDatabaseSource[];

  message?: string;
}

export interface IListDatabaseSourceServicesReply {
  code?: number;

  data?: IListDatabaseSourceService[];

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

  create_time?: string;

  create_user?: IUidWithName;

  desc?: string;

  name?: string;

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
  notification_body?: string;

  notification_subject?: string;

  user_uids?: string[];
}

export interface INotificationReply {
  code?: number;

  message?: string;
}

export interface IOauth2Configuration {
  access_token_tag?: string;

  client_host?: string;

  client_id?: string;

  client_key?: string;

  enable_oauth2?: boolean;

  login_tip?: string;

  scopes?: string[];

  server_auth_url?: string;

  server_token_url?: string;

  server_user_id_url?: string;

  user_id_tag?: string;

  user_email_tag?: string;

  user_wechat_tag?: string;
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

export interface IPlugin {
  add_db_service_pre_check_url?: string;

  del_db_service_pre_check_url?: string;

  del_user_group_pre_check_url?: string;

  del_user_pre_check_url?: string;

  name?: string;

  operate_data_resource_handle_url?: string;
}

export interface IProject {
  desc?: string;

  name?: string;
}

export interface IRegisterDMSPluginReply {
  code?: number;

  message?: string;
}

export interface IRegisterDMSProxyTargetReply {
  code?: number;

  message?: string;
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

export interface ITestFeishuConfiguration {
  account?: string;

  account_type?: TestFeishuConfigurationAccountTypeEnum;
}

export interface ITestFeishuConfigurationReply {
  code?: number;

  data?: ITestFeishuConfigurationResData;

  message?: string;
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

export interface IUidWithName {
  name?: string;

  uid?: string;
}

export interface IUpdateCompanyNotice {
  notice_str?: string;
}

export interface IUpdateCurrentUser {
  email?: string;

  old_password?: string;

  password?: string;

  phone?: string;

  wxid?: string;
}

export interface IUpdateDBService {
  additional_params?: IAdditionalParam[];

  business: string;

  db_type: string;

  desc?: string;

  host: string;

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

export interface IUpdateFeishuConfiguration {
  app_id?: string;

  app_secret?: string;

  is_feishu_notification_enabled?: boolean;
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

export interface IUpdateProject {
  desc?: string;
}

export interface IUpdateRole {
  desc?: string;

  is_disabled?: boolean;

  op_permission_uids?: string[];
}

export interface IUpdateSMTPConfiguration {
  enable_smtp_notify?: boolean;

  is_skip_verify?: boolean;

  smtp_host?: string;

  smtp_password?: string;

  smtp_port?: string;

  smtp_username?: string;
}

export interface IUpdateUser {
  email?: string;

  is_disabled?: boolean;

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

export interface IUpdateWeChatConfiguration {
  agent_id?: number;

  corp_id?: string;

  corp_secret?: string;

  enable_wechat_notify?: boolean;

  proxy_ip?: string;

  safe_enabled?: boolean;
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

export interface IWebHooksMessage {
  message?: string;

  trigger_event_type?: string;
}
