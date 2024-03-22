/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetBasicInfoReturn,
  IGetCompanyNoticeReturn,
  IUpdateCompanyNoticeParams,
  IUpdateCompanyNoticeReturn,
  IGetFeishuConfigurationReturn,
  IUpdateFeishuConfigurationParams,
  IUpdateFeishuConfigurationReturn,
  ITestFeishuConfigurationParams,
  ITestFeishuConfigurationReturn,
  IGetLDAPConfigurationReturn,
  IUpdateLDAPConfigurationParams,
  IUpdateLDAPConfigurationReturn,
  IGetLicenseReturn,
  ISetLicenseParams,
  ISetLicenseReturn,
  ICheckLicenseParams,
  ICheckLicenseReturn,
  IGetLicenseUsageReturn,
  IGetOauth2ConfigurationReturn,
  IUpdateOauth2ConfigurationParams,
  IUpdateOauth2ConfigurationReturn,
  IGetSMTPConfigurationReturn,
  IUpdateSMTPConfigurationParams,
  IUpdateSMTPConfigurationReturn,
  ITestSMTPConfigurationParams,
  ITestSMTPConfigurationReturn,
  IGetWebHookConfigurationReturn,
  IUpdateWebHookConfigurationParams,
  IUpdateWebHookConfigurationReturn,
  ITestWebHookConfigurationReturn,
  IGetWeChatConfigurationReturn,
  IUpdateWeChatConfigurationParams,
  IUpdateWeChatConfigurationReturn,
  ITestWeChatConfigurationParams,
  ITestWeChatConfigurationReturn,
  IListDBServiceDriverOptionReturn,
  IListMaskingRulesReturn,
  INotificationParams,
  INotificationReturn,
  IGetOauth2TipsReturn,
  IBindOauth2UserParams,
  IBindOauth2UserReturn,
  IListOpPermissionsParams,
  IListOpPermissionsReturn,
  IPersonalizationParams,
  IPersonalizationReturn,
  IRegisterDMSPluginParams,
  IRegisterDMSPluginReturn,
  IListProjectsParams,
  IListProjectsReturn,
  IAddProjectParams,
  IAddProjectReturn,
  IUpdateProjectParams,
  IUpdateProjectReturn,
  IDelProjectParams,
  IDelProjectReturn,
  IArchiveProjectParams,
  IArchiveProjectReturn,
  IBatchGetDataExportTaskParams,
  IBatchGetDataExportTaskReturn,
  IAddDataExportTaskParams,
  IAddDataExportTaskReturn,
  IListDataExportTaskSQLsParams,
  IListDataExportTaskSQLsReturn,
  IDownloadDataExportTaskSQLsParams,
  IDownloadDataExportTaskParams,
  IListDataExportWorkflowsParams,
  IListDataExportWorkflowsReturn,
  IAddDataExportWorkflowParams,
  IAddDataExportWorkflowReturn,
  ICancelDataExportWorkflowParams,
  ICancelDataExportWorkflowReturn,
  IGetDataExportWorkflowParams,
  IGetDataExportWorkflowReturn,
  IApproveDataExportWorkflowParams,
  IApproveDataExportWorkflowReturn,
  IExportDataExportWorkflowParams,
  IExportDataExportWorkflowReturn,
  IRejectDataExportWorkflowParams,
  IRejectDataExportWorkflowReturn,
  IListDatabaseSourceServicesParams,
  IListDatabaseSourceServicesReturn,
  IAddDatabaseSourceServiceParams,
  IAddDatabaseSourceServiceReturn,
  IListDatabaseSourceServiceTipsParams,
  IListDatabaseSourceServiceTipsReturn,
  IGetDatabaseSourceServiceParams,
  IGetDatabaseSourceServiceReturn,
  IUpdateDatabaseSourceServiceParams,
  IUpdateDatabaseSourceServiceReturn,
  IDeleteDatabaseSourceServiceParams,
  IDeleteDatabaseSourceServiceReturn,
  ISyncDatabaseSourceServiceParams,
  ISyncDatabaseSourceServiceReturn,
  IListDBServicesParams,
  IListDBServicesReturn,
  IAddDBServiceParams,
  IAddDBServiceReturn,
  ICheckDBServiceIsConnectableParams,
  ICheckDBServiceIsConnectableReturn,
  IListDBServiceTipsParams,
  IListDBServiceTipsReturn,
  IUpdateDBServiceParams,
  IUpdateDBServiceReturn,
  IDelDBServiceParams,
  IDelDBServiceReturn,
  ICheckDBServiceIsConnectableByIdParams,
  ICheckDBServiceIsConnectableByIdReturn,
  IListMemberGroupsParams,
  IListMemberGroupsReturn,
  IAddMemberGroupParams,
  IAddMemberGroupReturn,
  IGetMemberGroupParams,
  IGetMemberGroupReturn,
  IUpdateMemberGroupParams,
  IUpdateMemberGroupReturn,
  IDeleteMemberGroupParams,
  IDeleteMemberGroupReturn,
  IListMembersParams,
  IListMembersReturn,
  IAddMemberParams,
  IAddMemberReturn,
  IListMembersForInternalParams,
  IListMembersForInternalReturn,
  IListMemberTipsParams,
  IListMemberTipsReturn,
  IUpdateMemberParams,
  IUpdateMemberReturn,
  IDelMemberParams,
  IDelMemberReturn,
  IUnarchiveProjectParams,
  IUnarchiveProjectReturn,
  IRegisterDMSProxyTargetParams,
  IRegisterDMSProxyTargetReturn,
  IListRolesParams,
  IListRolesReturn,
  IAddRoleParams,
  IAddRoleReturn,
  IUpdateRoleParams,
  IUpdateRoleReturn,
  IDelRoleParams,
  IDelRoleReturn,
  IAddSessionParams,
  IAddSessionReturn,
  IDelSessionReturn,
  IGetUserBySessionParams,
  IGetUserBySessionReturn,
  IListUserGroupsParams,
  IListUserGroupsReturn,
  IAddUserGroupParams,
  IAddUserGroupReturn,
  IUpdateUserGroupParams,
  IUpdateUserGroupReturn,
  IDelUserGroupParams,
  IDelUserGroupReturn,
  IListUsersParams,
  IListUsersReturn,
  IUpdateCurrentUserParams,
  IUpdateCurrentUserReturn,
  IAddUserParams,
  IAddUserReturn,
  IGenAccessTokenParams,
  IGenAccessTokenReturn,
  IGetUserParams,
  IGetUserReturn,
  IUpdateUserParams,
  IUpdateUserReturn,
  IDelUserParams,
  IDelUserReturn,
  IGetUserOpPermissionParams,
  IGetUserOpPermissionReturn,
  IWebHookSendMessageParams,
  IWebHookSendMessageReturn
} from './index.d';

class DmsService extends ServiceBase {
  public GetBasicInfo(options?: AxiosRequestConfig) {
    return this.get<IGetBasicInfoReturn>(
      '/v1/dms/basic_info',
      undefined,
      options
    );
  }

  public GetCompanyNotice(options?: AxiosRequestConfig) {
    return this.get<IGetCompanyNoticeReturn>(
      '/v1/dms/company_notice',
      undefined,
      options
    );
  }

  public UpdateCompanyNotice(
    params: IUpdateCompanyNoticeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateCompanyNoticeReturn>(
      '/v1/dms/company_notice',
      paramsData,
      options
    );
  }

  public GetFeishuConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu',
      undefined,
      options
    );
  }

  public UpdateFeishuConfiguration(
    params: IUpdateFeishuConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu',
      paramsData,
      options
    );
  }

  public TestFeishuConfiguration(
    params: ITestFeishuConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestFeishuConfigurationReturn>(
      '/v1/dms/configurations/feishu/test',
      paramsData,
      options
    );
  }

  public GetLDAPConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetLDAPConfigurationReturn>(
      '/v1/dms/configurations/ldap',
      undefined,
      options
    );
  }

  public UpdateLDAPConfiguration(
    params: IUpdateLDAPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateLDAPConfigurationReturn>(
      '/v1/dms/configurations/ldap',
      paramsData,
      options
    );
  }

  public GetLicense(options?: AxiosRequestConfig) {
    return this.get<IGetLicenseReturn>(
      '/v1/dms/configurations/license',
      undefined,
      options
    );
  }

  public SetLicense(params: ISetLicenseParams, options?: AxiosRequestConfig) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ISetLicenseReturn>(
      '/v1/dms/configurations/license',
      paramsData,
      config
    );
  }

  public CheckLicense(
    params: ICheckLicenseParams,
    options?: AxiosRequestConfig
  ) {
    const config = options || {};
    const headers = config.headers ? config.headers : {};
    config.headers = {
      ...headers,

      'Content-Type': 'multipart/form-data'
    };

    const paramsData = new FormData();

    if (params.license_file != undefined) {
      paramsData.append('license_file', params.license_file as any);
    }

    return this.post<ICheckLicenseReturn>(
      '/v1/dms/configurations/license/check',
      paramsData,
      config
    );
  }

  public GetLicenseInfo(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/configurations/license/info', undefined, options);
  }

  public GetLicenseUsage(options?: AxiosRequestConfig) {
    return this.get<IGetLicenseUsageReturn>(
      '/v1/dms/configurations/license/usage',
      undefined,
      options
    );
  }

  public GetOauth2Configuration(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2ConfigurationReturn>(
      '/v1/dms/configurations/oauth2',
      undefined,
      options
    );
  }

  public UpdateOauth2Configuration(
    params: IUpdateOauth2ConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateOauth2ConfigurationReturn>(
      '/v1/dms/configurations/oauth2',
      paramsData,
      options
    );
  }

  public GetSMTPConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp',
      undefined,
      options
    );
  }

  public UpdateSMTPConfiguration(
    params: IUpdateSMTPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp',
      paramsData,
      options
    );
  }

  public TestSMTPConfiguration(
    params: ITestSMTPConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestSMTPConfigurationReturn>(
      '/v1/dms/configurations/smtp/test',
      paramsData,
      options
    );
  }

  public GetWebHookConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook',
      undefined,
      options
    );
  }

  public UpdateWebHookConfiguration(
    params: IUpdateWebHookConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook',
      paramsData,
      options
    );
  }

  public TestWebHookConfiguration(options?: AxiosRequestConfig) {
    return this.post<ITestWebHookConfigurationReturn>(
      '/v1/dms/configurations/webhook/test',
      undefined,
      options
    );
  }

  public GetWeChatConfiguration(options?: AxiosRequestConfig) {
    return this.get<IGetWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat',
      undefined,
      options
    );
  }

  public UpdateWeChatConfiguration(
    params: IUpdateWeChatConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.patch<IUpdateWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat',
      paramsData,
      options
    );
  }

  public TestWeChatConfiguration(
    params: ITestWeChatConfigurationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ITestWeChatConfigurationReturn>(
      '/v1/dms/configurations/wechat/test',
      paramsData,
      options
    );
  }

  public ListDBServiceDriverOption(options?: AxiosRequestConfig) {
    return this.get<IListDBServiceDriverOptionReturn>(
      '/v1/dms/db_services/driver_options',
      undefined,
      options
    );
  }

  public ListMaskingRules(options?: AxiosRequestConfig) {
    return this.get<IListMaskingRulesReturn>(
      '/v1/dms/masking/rules',
      undefined,
      options
    );
  }

  public Notification(
    params: INotificationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<INotificationReturn>(
      '/v1/dms/notifications',
      paramsData,
      options
    );
  }

  public GetOauth2Tips(options?: AxiosRequestConfig) {
    return this.get<IGetOauth2TipsReturn>(
      '/v1/dms/oauth2/tips',
      undefined,
      options
    );
  }

  public BindOauth2User(
    params: IBindOauth2UserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IBindOauth2UserReturn>(
      '/v1/dms/oauth2/user/bind',
      paramsData,
      options
    );
  }

  public ListOpPermissions(
    params: IListOpPermissionsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListOpPermissionsReturn>(
      '/v1/dms/op_permissions',
      paramsData,
      options
    );
  }

  public Personalization(
    params: IPersonalizationParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IPersonalizationReturn>(
      '/v1/dms/personalization',
      paramsData,
      options
    );
  }

  public GetStaticLogo(options?: AxiosRequestConfig) {
    return this.get('/v1/dms/personalization/logo', undefined, options);
  }

  public RegisterDMSPlugin(
    params: IRegisterDMSPluginParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IRegisterDMSPluginReturn>(
      '/v1/dms/plugin',
      paramsData,
      options
    );
  }

  public ListProjects(
    params: IListProjectsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListProjectsReturn>(
      '/v1/dms/projects',
      paramsData,
      options
    );
  }

  public AddProject(params: IAddProjectParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddProjectReturn>(
      '/v1/dms/projects',
      paramsData,
      options
    );
  }

  public UpdateProject(
    params: IUpdateProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IUpdateProjectReturn>(
      `/v1/dms/projects/${project_uid}`,
      paramsData,
      options
    );
  }

  public DelProject(params: IDelProjectParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.delete<IDelProjectReturn>(
      `/v1/dms/projects/${project_uid}`,
      paramsData,
      options
    );
  }

  public ArchiveProject(
    params: IArchiveProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IArchiveProjectReturn>(
      `/v1/dms/projects/${project_uid}/archive`,
      paramsData,
      options
    );
  }

  public BatchGetDataExportTask(
    params: IBatchGetDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IBatchGetDataExportTaskReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks`,
      paramsData,
      options
    );
  }

  public AddDataExportTask(
    params: IAddDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDataExportTaskReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks`,
      paramsData,
      options
    );
  }

  public ListDataExportTaskSQLs(
    params: IListDataExportTaskSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get<IListDataExportTaskSQLsReturn>(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/data_export_task_sqls`,
      paramsData,
      options
    );
  }

  public DownloadDataExportTaskSQLs(
    params: IDownloadDataExportTaskSQLsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/data_export_task_sqls/download`,
      paramsData,
      options
    );
  }

  public DownloadDataExportTask(
    params: IDownloadDataExportTaskParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_task_uid = paramsData.data_export_task_uid;
    delete paramsData.data_export_task_uid;

    return this.get(
      `/v1/dms/projects/${project_uid}/data_export_tasks/${data_export_task_uid}/download`,
      paramsData,
      options
    );
  }

  public ListDataExportWorkflows(
    params: IListDataExportWorkflowsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDataExportWorkflowsReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows`,
      paramsData,
      options
    );
  }

  public AddDataExportWorkflow(
    params: IAddDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows`,
      paramsData,
      options
    );
  }

  public CancelDataExportWorkflow(
    params: ICancelDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICancelDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/cancel`,
      paramsData,
      options
    );
  }

  public GetDataExportWorkflow(
    params: IGetDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.get<IGetDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}`,
      paramsData,
      options
    );
  }

  public ApproveDataExportWorkflow(
    params: IApproveDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IApproveDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/approve`,
      paramsData,
      options
    );
  }

  public ExportDataExportWorkflow(
    params: IExportDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IExportDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/export`,
      paramsData,
      options
    );
  }

  public RejectDataExportWorkflow(
    params: IRejectDataExportWorkflowParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const data_export_workflow_uid = paramsData.data_export_workflow_uid;
    delete paramsData.data_export_workflow_uid;

    return this.post<IRejectDataExportWorkflowReturn>(
      `/v1/dms/projects/${project_uid}/data_export_workflows/${data_export_workflow_uid}/reject`,
      paramsData,
      options
    );
  }

  public ListDatabaseSourceServices(
    params: IListDatabaseSourceServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDatabaseSourceServicesReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services`,
      paramsData,
      options
    );
  }

  public AddDatabaseSourceService(
    params: IAddDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services`,
      paramsData,
      options
    );
  }

  public ListDatabaseSourceServiceTips(
    params: IListDatabaseSourceServiceTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDatabaseSourceServiceTipsReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/tips`,
      paramsData,
      options
    );
  }

  public GetDatabaseSourceService(
    params: IGetDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.get<IGetDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public UpdateDatabaseSourceService(
    params: IUpdateDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.put<IUpdateDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public DeleteDatabaseSourceService(
    params: IDeleteDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.delete<IDeleteDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}`,
      paramsData,
      options
    );
  }

  public SyncDatabaseSourceService(
    params: ISyncDatabaseSourceServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const database_source_service_uid = paramsData.database_source_service_uid;
    delete paramsData.database_source_service_uid;

    return this.post<ISyncDatabaseSourceServiceReturn>(
      `/v1/dms/projects/${project_uid}/database_source_services/${database_source_service_uid}/sync`,
      paramsData,
      options
    );
  }

  public ListDBServices(
    params: IListDBServicesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServicesReturn>(
      `/v1/dms/projects/${project_uid}/db_services`,
      paramsData,
      options
    );
  }

  public AddDBService(
    params: IAddDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services`,
      paramsData,
      options
    );
  }

  public CheckDBServiceIsConnectable(
    params: ICheckDBServiceIsConnectableParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<ICheckDBServiceIsConnectableReturn>(
      `/v1/dms/projects/${project_uid}/db_services/connection`,
      paramsData,
      options
    );
  }

  public ListDBServiceTips(
    params: IListDBServiceTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListDBServiceTipsReturn>(
      `/v1/dms/projects/${project_uid}/db_services/tips`,
      paramsData,
      options
    );
  }

  public UpdateDBService(
    params: IUpdateDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.put<IUpdateDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}`,
      paramsData,
      options
    );
  }

  public DelDBService(
    params: IDelDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.delete<IDelDBServiceReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}`,
      paramsData,
      options
    );
  }

  public CheckDBServiceIsConnectableById(
    params: ICheckDBServiceIsConnectableByIdParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.post<ICheckDBServiceIsConnectableByIdReturn>(
      `/v1/dms/projects/${project_uid}/db_services/${db_service_uid}/connection`,
      paramsData,
      options
    );
  }

  public ListMemberGroups(
    params: IListMemberGroupsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMemberGroupsReturn>(
      `/v1/dms/projects/${project_uid}/member_groups`,
      paramsData,
      options
    );
  }

  public AddMemberGroup(
    params: IAddMemberGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddMemberGroupReturn>(
      `/v1/dms/projects/${project_uid}/member_groups`,
      paramsData,
      options
    );
  }

  public GetMemberGroup(
    params: IGetMemberGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const member_group_uid = paramsData.member_group_uid;
    delete paramsData.member_group_uid;

    return this.get<IGetMemberGroupReturn>(
      `/v1/dms/projects/${project_uid}/member_groups/${member_group_uid}`,
      paramsData,
      options
    );
  }

  public UpdateMemberGroup(
    params: IUpdateMemberGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const member_group_uid = paramsData.member_group_uid;
    delete paramsData.member_group_uid;

    return this.put<IUpdateMemberGroupReturn>(
      `/v1/dms/projects/${project_uid}/member_groups/${member_group_uid}`,
      paramsData,
      options
    );
  }

  public DeleteMemberGroup(
    params: IDeleteMemberGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const member_group_uid = paramsData.member_group_uid;
    delete paramsData.member_group_uid;

    return this.delete<IDeleteMemberGroupReturn>(
      `/v1/dms/projects/${project_uid}/member_groups/${member_group_uid}`,
      paramsData,
      options
    );
  }

  public ListMembers(params: IListMembersParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMembersReturn>(
      `/v1/dms/projects/${project_uid}/members`,
      paramsData,
      options
    );
  }

  public AddMember(params: IAddMemberParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAddMemberReturn>(
      `/v1/dms/projects/${project_uid}/members`,
      paramsData,
      options
    );
  }

  public ListMembersForInternal(
    params: IListMembersForInternalParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMembersForInternalReturn>(
      `/v1/dms/projects/${project_uid}/members/internal`,
      paramsData,
      options
    );
  }

  public ListMemberTips(
    params: IListMemberTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IListMemberTipsReturn>(
      `/v1/dms/projects/${project_uid}/members/tips`,
      paramsData,
      options
    );
  }

  public UpdateMember(
    params: IUpdateMemberParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const member_uid = paramsData.member_uid;
    delete paramsData.member_uid;

    return this.put<IUpdateMemberReturn>(
      `/v1/dms/projects/${project_uid}/members/${member_uid}`,
      paramsData,
      options
    );
  }

  public DelMember(params: IDelMemberParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const member_uid = paramsData.member_uid;
    delete paramsData.member_uid;

    return this.delete<IDelMemberReturn>(
      `/v1/dms/projects/${project_uid}/members/${member_uid}`,
      paramsData,
      options
    );
  }

  public UnarchiveProject(
    params: IUnarchiveProjectParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IUnarchiveProjectReturn>(
      `/v1/dms/projects/${project_uid}/unarchive`,
      paramsData,
      options
    );
  }

  public RegisterDMSProxyTarget(
    params: IRegisterDMSProxyTargetParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IRegisterDMSProxyTargetReturn>(
      '/v1/dms/proxy',
      paramsData,
      options
    );
  }

  public ListRoles(params: IListRolesParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListRolesReturn>('/v1/dms/roles', paramsData, options);
  }

  public AddRole(params: IAddRoleParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddRoleReturn>('/v1/dms/roles', paramsData, options);
  }

  public UpdateRole(params: IUpdateRoleParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const role_uid = paramsData.role_uid;
    delete paramsData.role_uid;

    return this.put<IUpdateRoleReturn>(
      `/v1/dms/roles/${role_uid}`,
      paramsData,
      options
    );
  }

  public DelRole(params: IDelRoleParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const role_uid = paramsData.role_uid;
    delete paramsData.role_uid;

    return this.delete<IDelRoleReturn>(
      `/v1/dms/roles/${role_uid}`,
      paramsData,
      options
    );
  }

  public AddSession(params: IAddSessionParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddSessionReturn>(
      '/v1/dms/sessions',
      paramsData,
      options
    );
  }

  public DelSession(options?: AxiosRequestConfig) {
    return this.delete<IDelSessionReturn>(
      '/v1/dms/sessions',
      undefined,
      options
    );
  }

  public GetUserBySession(
    params: IGetUserBySessionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetUserBySessionReturn>(
      '/v1/dms/sessions/user',
      paramsData,
      options
    );
  }

  public ListUserGroups(
    params: IListUserGroupsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUserGroupsReturn>(
      '/v1/dms/user_groups',
      paramsData,
      options
    );
  }

  public AddUserGroup(
    params: IAddUserGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddUserGroupReturn>(
      '/v1/dms/user_groups',
      paramsData,
      options
    );
  }

  public UpdateUserGroup(
    params: IUpdateUserGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_group_uid = paramsData.user_group_uid;
    delete paramsData.user_group_uid;

    return this.put<IUpdateUserGroupReturn>(
      `/v1/dms/user_groups/${user_group_uid}`,
      paramsData,
      options
    );
  }

  public DelUserGroup(
    params: IDelUserGroupParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_group_uid = paramsData.user_group_uid;
    delete paramsData.user_group_uid;

    return this.delete<IDelUserGroupReturn>(
      `/v1/dms/user_groups/${user_group_uid}`,
      paramsData,
      options
    );
  }

  public ListUsers(params: IListUsersParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<IListUsersReturn>('/v1/dms/users', paramsData, options);
  }

  public UpdateCurrentUser(
    params: IUpdateCurrentUserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.put<IUpdateCurrentUserReturn>(
      '/v1/dms/users',
      paramsData,
      options
    );
  }

  public AddUser(params: IAddUserParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAddUserReturn>('/v1/dms/users', paramsData, options);
  }

  public GenAccessToken(
    params: IGenAccessTokenParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IGenAccessTokenReturn>(
      '/v1/dms/users/gen_token',
      paramsData,
      options
    );
  }

  public GetUser(params: IGetUserParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const user_uid = paramsData.user_uid;
    delete paramsData.user_uid;

    return this.get<IGetUserReturn>(
      `/v1/dms/users/${user_uid}`,
      paramsData,
      options
    );
  }

  public UpdateUser(params: IUpdateUserParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const user_uid = paramsData.user_uid;
    delete paramsData.user_uid;

    return this.put<IUpdateUserReturn>(
      `/v1/dms/users/${user_uid}`,
      paramsData,
      options
    );
  }

  public DelUser(params: IDelUserParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const user_uid = paramsData.user_uid;
    delete paramsData.user_uid;

    return this.delete<IDelUserReturn>(
      `/v1/dms/users/${user_uid}`,
      paramsData,
      options
    );
  }

  public GetUserOpPermission(
    params: IGetUserOpPermissionParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const user_uid = paramsData.user_uid;
    delete paramsData.user_uid;

    return this.get<IGetUserOpPermissionReturn>(
      `/v1/dms/users/${user_uid}/op_permission`,
      paramsData,
      options
    );
  }

  public WebHookSendMessage(
    params: IWebHookSendMessageParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IWebHookSendMessageReturn>(
      '/v1/dms/webhooks',
      paramsData,
      options
    );
  }
}

export default new DmsService();
