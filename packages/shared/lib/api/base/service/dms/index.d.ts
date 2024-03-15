import {
  IGetBasicInfoReply,
  IGetCompanyNoticeReply,
  IUpdateCompanyNotice,
  IGenericResp,
  IGetFeishuConfigurationReply,
  IUpdateFeishuConfiguration,
  ITestFeishuConfiguration,
  ITestFeishuConfigurationReply,
  IGetLDAPConfigurationResDataReply,
  ILDAPConfiguration,
  IGetLicenseReply,
  ICheckLicenseReply,
  IGetLicenseUsageReply,
  IGetOauth2ConfigurationResDataReply,
  IOauth2Configuration,
  IGetSMTPConfigurationReply,
  IUpdateSMTPConfiguration,
  ITestSMTPConfiguration,
  ITestSMTPConfigurationReply,
  IGetWebHookConfigurationReply,
  IWebHookConfigurationData,
  ITestWebHookConfigurationReply,
  IGetWeChatConfigurationReply,
  IUpdateWeChatConfiguration,
  ITestWeChatConfiguration,
  ITestWeChatConfigurationReply,
  IListDBServiceDriverOptionReply,
  IListMaskingRulesReply,
  INotification,
  INotificationReply,
  IGetOauth2TipsReply,
  IBindOauth2UserReply,
  IListOpPermissionReply,
  IPlugin,
  IListProjectReply,
  IProject,
  IAddProjectReply,
  IUpdateProject,
  IBatchGetDataExportTaskReply,
  IDataExportTask,
  IAddDataExportTaskReply,
  IListDataExportTaskSQLsReply,
  IListDataExportWorkflowsReply,
  IDataExportWorkflow,
  IAddDataExportWorkflowReply,
  ICancelDataExportWorkflowPayload,
  IGetDataExportWorkflowReply,
  IRejectDataExportWorkflowPayload,
  IListDatabaseSourceServicesReply,
  IDatabaseSourceService,
  IAddDatabaseSourceServiceReply,
  IListDatabaseSourceServiceTipsReply,
  IGetDatabaseSourceServiceReply,
  IListDBServiceReply,
  IDBService,
  IAddDBServiceReply,
  ICheckDbConnectable,
  ICheckDBServiceIsConnectableReply,
  IListDBServiceTipsReply,
  IUpdateDBService,
  IListMemberGroupsReply,
  IMemberGroup,
  IAddMemberGroupReply,
  IGetMemberGroupReply,
  IUpdateMemberGroup,
  IListMemberReply,
  IMember,
  IAddMemberReply,
  IListMembersForInternalReply,
  IListMemberTipsReply,
  IUpdateMember,
  IDMSProxyTarget,
  IListRoleReply,
  IRole,
  IAddRoleReply,
  IUpdateRole,
  IAddSession,
  IAddSessionReply,
  IGetUserBySessionReply,
  IListUserGroupReply,
  IUserGroup,
  IAddUserGroupReply,
  IUpdateUserGroup,
  IListUserReply,
  IUpdateCurrentUser,
  IUser,
  IAddUserReply,
  IGetUserReply,
  IUpdateUser,
  IUserOpPermission,
  IGetUserOpPermissionReply,
  IWebHooksMessage,
  IWebHookSendMessageReply
} from '../common.d';

import {
  ListOpPermissionsOrderByEnum,
  ListOpPermissionsFilterByTargetEnum,
  ListProjectsOrderByEnum,
  ListDataExportWorkflowsFilterByStatusEnum,
  ListDBServicesOrderByEnum,
  ListDBServiceTipsFunctionalModuleEnum,
  ListMemberGroupsOrderByEnum,
  ListMembersOrderByEnum,
  ListRolesOrderByEnum,
  ListUserGroupsOrderByEnum,
  ListUsersOrderByEnum
} from './index.enum';

export interface IGetBasicInfoReturn extends IGetBasicInfoReply {}

export interface IGetCompanyNoticeReturn extends IGetCompanyNoticeReply {}

export interface IUpdateCompanyNoticeParams {
  company_notice?: IUpdateCompanyNotice;
}

export interface IUpdateCompanyNoticeReturn extends IGenericResp {}

export interface IGetFeishuConfigurationReturn
  extends IGetFeishuConfigurationReply {}

export interface IUpdateFeishuConfigurationParams {
  update_feishu_configuration?: IUpdateFeishuConfiguration;
}

export interface IUpdateFeishuConfigurationReturn extends IGenericResp {}

export interface ITestFeishuConfigurationParams {
  test_feishu_configuration?: ITestFeishuConfiguration;
}

export interface ITestFeishuConfigurationReturn
  extends ITestFeishuConfigurationReply {}

export interface IGetLDAPConfigurationReturn
  extends IGetLDAPConfigurationResDataReply {}

export interface IUpdateLDAPConfigurationParams {
  ldap?: ILDAPConfiguration;
}

export interface IUpdateLDAPConfigurationReturn extends IGenericResp {}

export interface IGetLicenseReturn extends IGetLicenseReply {}

export interface ISetLicenseParams {
  license_file?: any;
}

export interface ISetLicenseReturn extends IGenericResp {}

export interface ICheckLicenseParams {
  license_file?: any;
}

export interface ICheckLicenseReturn extends ICheckLicenseReply {}

export interface IGetLicenseUsageReturn extends IGetLicenseUsageReply {}

export interface IGetOauth2ConfigurationReturn
  extends IGetOauth2ConfigurationResDataReply {}

export interface IUpdateOauth2ConfigurationParams {
  oauth2?: IOauth2Configuration;
}

export interface IUpdateOauth2ConfigurationReturn extends IGenericResp {}

export interface IGetSMTPConfigurationReturn
  extends IGetSMTPConfigurationReply {}

export interface IUpdateSMTPConfigurationParams {
  smtp_configuration?: IUpdateSMTPConfiguration;
}

export interface IUpdateSMTPConfigurationReturn extends IGenericResp {}

export interface ITestSMTPConfigurationParams {
  test_smtp_configuration?: ITestSMTPConfiguration;
}

export interface ITestSMTPConfigurationReturn
  extends ITestSMTPConfigurationReply {}

export interface IGetWebHookConfigurationReturn
  extends IGetWebHookConfigurationReply {}

export interface IUpdateWebHookConfigurationParams {
  webhook_config?: IWebHookConfigurationData;
}

export interface IUpdateWebHookConfigurationReturn extends IGenericResp {}

export interface ITestWebHookConfigurationReturn
  extends ITestWebHookConfigurationReply {}

export interface IGetWeChatConfigurationReturn
  extends IGetWeChatConfigurationReply {}

export interface IUpdateWeChatConfigurationParams {
  update_wechat_configuration?: IUpdateWeChatConfiguration;
}

export interface IUpdateWeChatConfigurationReturn extends IGenericResp {}

export interface ITestWeChatConfigurationParams {
  test_wechat_configuration?: ITestWeChatConfiguration;
}

export interface ITestWeChatConfigurationReturn
  extends ITestWeChatConfigurationReply {}

export interface IListDBServiceDriverOptionReturn
  extends IListDBServiceDriverOptionReply {}

export interface IListMaskingRulesReturn extends IListMaskingRulesReply {}

export interface INotificationParams {
  notification?: INotification;
}

export interface INotificationReturn extends INotificationReply {}

export interface IGetOauth2TipsReturn extends IGetOauth2TipsReply {}

export interface IBindOauth2UserParams {
  user_name?: string;

  pwd?: string;

  oauth2_token?: string;
}

export interface IBindOauth2UserReturn extends IBindOauth2UserReply {}

export interface IListOpPermissionsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListOpPermissionsOrderByEnum;

  filter_by_target?: ListOpPermissionsFilterByTargetEnum;
}

export interface IListOpPermissionsReturn extends IListOpPermissionReply {}

export interface IPersonalizationParams {
  title?: string;

  file?: any;
}

export interface IPersonalizationReturn extends IGenericResp {}

export interface IRegisterDMSPluginParams {
  plugin?: IPlugin;
}

export interface IRegisterDMSPluginReturn extends IGenericResp {}

export interface IListProjectsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListProjectsOrderByEnum;

  filter_by_name?: string;

  filter_by_uid?: string;
}

export interface IListProjectsReturn extends IListProjectReply {}

export interface IAddProjectParams {
  project?: IProject;
}

export interface IAddProjectReturn extends IAddProjectReply {}

export interface IUpdateProjectParams {
  project_uid: string;

  project?: IUpdateProject;
}

export interface IUpdateProjectReturn extends IGenericResp {}

export interface IDelProjectParams {
  project_uid: string;
}

export interface IDelProjectReturn extends IGenericResp {}

export interface IArchiveProjectParams {
  project_uid: string;
}

export interface IArchiveProjectReturn extends IGenericResp {}

export interface IBatchGetDataExportTaskParams {
  project_uid: string;

  data_export_task_uids: string;
}

export interface IBatchGetDataExportTaskReturn
  extends IBatchGetDataExportTaskReply {}

export interface IAddDataExportTaskParams {
  project_uid: string;

  data_export_tasks?: IDataExportTask[];
}

export interface IAddDataExportTaskReturn extends IAddDataExportTaskReply {}

export interface IListDataExportTaskSQLsParams {
  project_uid: string;

  data_export_task_uid: string;

  page_size: number;

  page_index?: number;
}

export interface IListDataExportTaskSQLsReturn
  extends IListDataExportTaskSQLsReply {}

export interface IDownloadDataExportTaskSQLsParams {
  project_uid: string;

  data_export_task_uid: string;
}

export interface IDownloadDataExportTaskParams {
  project_uid: string;

  data_export_task_uid: string;
}

export interface IListDataExportWorkflowsParams {
  project_uid: string;

  page_size: number;

  page_index?: number;

  filter_by_status?: ListDataExportWorkflowsFilterByStatusEnum;

  filter_by_create_user_uid?: string;

  filter_current_step_assignee_user_uid?: string;

  filter_by_db_service_uid?: string;

  filter_create_time_from?: string;

  filter_create_time_to?: string;

  fuzzy_keyword?: string;
}

export interface IListDataExportWorkflowsReturn
  extends IListDataExportWorkflowsReply {}

export interface IAddDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow?: IDataExportWorkflow;
}

export interface IAddDataExportWorkflowReturn
  extends IAddDataExportWorkflowReply {}

export interface ICancelDataExportWorkflowParams {
  project_uid: string;

  payload: ICancelDataExportWorkflowPayload;
}

export interface ICancelDataExportWorkflowReturn extends IGenericResp {}

export interface IGetDataExportWorkflowParams {
  data_export_workflow_uid: string;

  project_uid: string;
}

export interface IGetDataExportWorkflowReturn
  extends IGetDataExportWorkflowReply {}

export interface IApproveDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IApproveDataExportWorkflowReturn extends IGenericResp {}

export interface IExportDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;
}

export interface IExportDataExportWorkflowReturn extends IGenericResp {}

export interface IRejectDataExportWorkflowParams {
  project_uid: string;

  data_export_workflow_uid: string;

  payload: IRejectDataExportWorkflowPayload;
}

export interface IRejectDataExportWorkflowReturn extends IGenericResp {}

export interface IListDatabaseSourceServicesParams {
  project_uid: string;
}

export interface IListDatabaseSourceServicesReturn
  extends IListDatabaseSourceServicesReply {}

export interface IAddDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service?: IDatabaseSourceService;
}

export interface IAddDatabaseSourceServiceReturn
  extends IAddDatabaseSourceServiceReply {}

export interface IListDatabaseSourceServiceTipsParams {
  project_uid: string;
}

export interface IListDatabaseSourceServiceTipsReturn
  extends IListDatabaseSourceServiceTipsReply {}

export interface IGetDatabaseSourceServiceParams {
  database_source_service_uid: string;

  project_uid: string;
}

export interface IGetDatabaseSourceServiceReturn
  extends IGetDatabaseSourceServiceReply {}

export interface IUpdateDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service_uid: string;

  database_source_service?: IDatabaseSourceService;
}

export interface IUpdateDatabaseSourceServiceReturn extends IGenericResp {}

export interface IDeleteDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service_uid: string;
}

export interface IDeleteDatabaseSourceServiceReturn extends IGenericResp {}

export interface ISyncDatabaseSourceServiceParams {
  project_uid: string;

  database_source_service_uid: string;
}

export interface ISyncDatabaseSourceServiceReturn extends IGenericResp {}

export interface IListDBServicesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListDBServicesOrderByEnum;

  filter_by_business?: string;

  filter_by_host?: string;

  filter_by_uid?: string;

  filter_by_name?: string;

  filter_by_port?: string;

  filter_by_db_type?: string;

  project_uid: string;

  fuzzy_keyword?: string;

  is_enable_masking?: boolean;
}

export interface IListDBServicesReturn extends IListDBServiceReply {}

export interface IAddDBServiceParams {
  project_uid: string;

  db_service?: IDBService;
}

export interface IAddDBServiceReturn extends IAddDBServiceReply {}

export interface ICheckDBServiceIsConnectableParams {
  project_uid: string;

  db_service?: ICheckDbConnectable;
}

export interface ICheckDBServiceIsConnectableReturn
  extends ICheckDBServiceIsConnectableReply {}

export interface IListDBServiceTipsParams {
  project_uid: string;

  filter_db_type?: string;

  functional_module?: ListDBServiceTipsFunctionalModuleEnum;
}

export interface IListDBServiceTipsReturn extends IListDBServiceTipsReply {}

export interface IUpdateDBServiceParams {
  project_uid: string;

  db_service_uid: string;

  db_service?: IUpdateDBService;
}

export interface IUpdateDBServiceReturn extends IGenericResp {}

export interface IDelDBServiceParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IDelDBServiceReturn extends IGenericResp {}

export interface ICheckDBServiceIsConnectableByIdParams {
  project_uid: string;

  db_service_uid: string;
}

export interface ICheckDBServiceIsConnectableByIdReturn
  extends ICheckDBServiceIsConnectableReply {}

export interface IListMemberGroupsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListMemberGroupsOrderByEnum;

  filter_by_name?: string;

  project_uid: string;
}

export interface IListMemberGroupsReturn extends IListMemberGroupsReply {}

export interface IAddMemberGroupParams {
  project_uid: string;

  member_group?: IMemberGroup;
}

export interface IAddMemberGroupReturn extends IAddMemberGroupReply {}

export interface IGetMemberGroupParams {
  member_group_uid: string;

  project_uid: string;
}

export interface IGetMemberGroupReturn extends IGetMemberGroupReply {}

export interface IUpdateMemberGroupParams {
  project_uid: string;

  member_group_uid: string;

  member_group?: IUpdateMemberGroup;
}

export interface IUpdateMemberGroupReturn extends IGenericResp {}

export interface IDeleteMemberGroupParams {
  project_uid: string;

  member_group_uid: string;
}

export interface IDeleteMemberGroupReturn extends IGenericResp {}

export interface IListMembersParams {
  page_size: number;

  page_index?: number;

  order_by?: ListMembersOrderByEnum;

  filter_by_user_uid?: string;

  project_uid: string;
}

export interface IListMembersReturn extends IListMemberReply {}

export interface IAddMemberParams {
  project_uid: string;

  member?: IMember;
}

export interface IAddMemberReturn extends IAddMemberReply {}

export interface IListMembersForInternalParams {
  page_size: number;

  page_index?: number;

  project_uid: string;
}

export interface IListMembersForInternalReturn
  extends IListMembersForInternalReply {}

export interface IListMemberTipsParams {
  project_uid: string;
}

export interface IListMemberTipsReturn extends IListMemberTipsReply {}

export interface IUpdateMemberParams {
  project_uid: string;

  member_uid: string;

  member?: IUpdateMember;
}

export interface IUpdateMemberReturn extends IGenericResp {}

export interface IDelMemberParams {
  project_uid: string;

  member_uid: string;
}

export interface IDelMemberReturn extends IGenericResp {}

export interface IUnarchiveProjectParams {
  project_uid: string;
}

export interface IUnarchiveProjectReturn extends IGenericResp {}

export interface IRegisterDMSProxyTargetParams {
  dms_proxy_target?: IDMSProxyTarget;
}

export interface IRegisterDMSProxyTargetReturn extends IGenericResp {}

export interface IListRolesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListRolesOrderByEnum;

  filter_by_name?: string;
}

export interface IListRolesReturn extends IListRoleReply {}

export interface IAddRoleParams {
  role?: IRole;
}

export interface IAddRoleReturn extends IAddRoleReply {}

export interface IUpdateRoleParams {
  role_uid: string;

  role?: IUpdateRole;
}

export interface IUpdateRoleReturn extends IGenericResp {}

export interface IDelRoleParams {
  role_uid: string;
}

export interface IDelRoleReturn extends IGenericResp {}

export interface IAddSessionParams {
  session?: IAddSession;
}

export interface IAddSessionReturn extends IAddSessionReply {}

export interface IDelSessionReturn extends IGenericResp {}

export interface IGetUserBySessionParams {
  user_uid?: string;
}

export interface IGetUserBySessionReturn extends IGetUserBySessionReply {}

export interface IListUserGroupsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListUserGroupsOrderByEnum;

  filter_by_name?: string;
}

export interface IListUserGroupsReturn extends IListUserGroupReply {}

export interface IAddUserGroupParams {
  user_group?: IUserGroup;
}

export interface IAddUserGroupReturn extends IAddUserGroupReply {}

export interface IUpdateUserGroupParams {
  user_group_uid: string;

  user_group?: IUpdateUserGroup;
}

export interface IUpdateUserGroupReturn extends IGenericResp {}

export interface IDelUserGroupParams {
  user_group_uid: string;
}

export interface IDelUserGroupReturn extends IGenericResp {}

export interface IListUsersParams {
  page_size: number;

  page_index?: number;

  order_by?: ListUsersOrderByEnum;

  filter_by_name?: string;

  filter_by_uids?: string;

  filter_del_user?: boolean;
}

export interface IListUsersReturn extends IListUserReply {}

export interface IUpdateCurrentUserParams {
  current_user?: IUpdateCurrentUser;
}

export interface IUpdateCurrentUserReturn extends IGenericResp {}

export interface IAddUserParams {
  user?: IUser;
}

export interface IAddUserReturn extends IAddUserReply {}

export interface IGetUserParams {
  user_uid: string;
}

export interface IGetUserReturn extends IGetUserReply {}

export interface IUpdateUserParams {
  user_uid: string;

  user?: IUpdateUser;
}

export interface IUpdateUserReturn extends IGenericResp {}

export interface IDelUserParams {
  user_uid: string;
}

export interface IDelUserReturn extends IGenericResp {}

export interface IGetUserOpPermissionParams {
  user_uid: string;

  user_op_permission?: IUserOpPermission;
}

export interface IGetUserOpPermissionReturn extends IGetUserOpPermissionReply {}

export interface IWebHookSendMessageParams {
  webhook_message?: IWebHooksMessage;
}

export interface IWebHookSendMessageReturn extends IWebHookSendMessageReply {}
