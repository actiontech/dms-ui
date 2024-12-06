/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuditListAuthorizationEventsParams,
  IAuditListAuthorizationEventsReturn,
  IAuditListDataObjectServiceEventsParams,
  IAuditListDataObjectServiceEventsReturn,
  IAuditListDataPermissionTemplateEventsParams,
  IAuditListDataPermissionTemplateEventsReturn,
  IAuthListDataObjectSourcesParams,
  IAuthListDataObjectSourcesReturn,
  IAuthAddDataObjectSourceParams,
  IAuthAddDataObjectSourceReturn,
  IAuthUpdateDataObjectSourceParams,
  IAuthUpdateDataObjectSourceReturn,
  IAuthDelDataObjectSourceParams,
  IAuthDelDataObjectSourceReturn,
  IAuthSyncFromDataObjectSourceParams,
  IAuthSyncFromDataObjectSourceReturn,
  IAuthListDataOperationSetsParams,
  IAuthListDataOperationSetsReturn,
  IAuthAddDataPermissionTemplateParams,
  IAuthAddDataPermissionTemplateReturn,
  IAuthUpdateDataPermissionTemplateParams,
  IAuthUpdateDataPermissionTemplateReturn,
  IAuthCopyDataPermissionTemplateParams,
  IAuthCopyDataPermissionTemplateReturn,
  IAuthGetDataPermissionsInDataPermissionTemplateParams,
  IAuthGetDataPermissionsInDataPermissionTemplateReturn,
  IAuthGetStatementByDataPermissionTemplatesParams,
  IAuthGetStatementByDataPermissionTemplatesReturn,
  IAuthVerifyDBAccountParams,
  IAuthVerifyDBAccountReturn,
  IOperateDataResourceHandleParams,
  IOperateDataResourceHandleReturn,
  IAuthListDatabaseParams,
  IAuthListDatabaseReturn,
  IAuthListOperationsParams,
  IAuthListOperationsReturn,
  IAuthListServiceParams,
  IAuthListServiceReturn,
  IAddServiceReturn,
  IAuthListBusinessParams,
  IAuthListBusinessReturn,
  IAddDBServicePreCheckParams,
  IAddDBServicePreCheckReturn,
  IDelDBServicePreCheckParams,
  IDelDBServicePreCheckReturn,
  IAuthSyncServiceParams,
  IAuthSyncServiceReturn,
  IAuthUpdateServiceParams,
  IAuthUpdateServiceReturn,
  IAuthDelServiceParams,
  IAuthDelServiceReturn,
  IAuthGetUsersFromDBServiceParams,
  IAuthGetUsersFromDBServiceReturn,
  IAuthListTableParams,
  IAuthListTableReturn,
  IDelUserGroupPreCheckParams,
  IDelUserGroupPreCheckReturn,
  IAuthListUserParams,
  IAuthListUserReturn
} from './index.d';

class AuthService extends ServiceBase {
  public AuditListAuthorizationEvents(
    params: IAuditListAuthorizationEventsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuditListAuthorizationEventsReturn>(
      '/v1/audit/authorization_events',
      paramsData,
      options
    );
  }

  public AuditListDataObjectServiceEvents(
    params: IAuditListDataObjectServiceEventsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuditListDataObjectServiceEventsReturn>(
      '/v1/audit/data_object_service_events',
      paramsData,
      options
    );
  }

  public AuditListDataPermissionTemplateEvents(
    params: IAuditListDataPermissionTemplateEventsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuditListDataPermissionTemplateEventsReturn>(
      '/v1/audit/data_permission_template_events',
      paramsData,
      options
    );
  }

  public AuthListDataObjectSources(
    params: IAuthListDataObjectSourcesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListDataObjectSourcesReturn>(
      '/v1/auth/data_object_sources',
      paramsData,
      options
    );
  }

  public AuthAddDataObjectSource(
    params: IAuthAddDataObjectSourceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAuthAddDataObjectSourceReturn>(
      '/v1/auth/data_object_sources',
      paramsData,
      options
    );
  }

  public AuthUpdateDataObjectSource(
    params: IAuthUpdateDataObjectSourceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const uid = paramsData.uid;
    delete paramsData.uid;

    return this.put<IAuthUpdateDataObjectSourceReturn>(
      `/v1/auth/data_object_sources/${uid}`,
      paramsData,
      options
    );
  }

  public AuthDelDataObjectSource(
    params: IAuthDelDataObjectSourceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const uid = paramsData.uid;
    delete paramsData.uid;

    return this.delete<IAuthDelDataObjectSourceReturn>(
      `/v1/auth/data_object_sources/${uid}`,
      paramsData,
      options
    );
  }

  public AuthSyncFromDataObjectSource(
    params: IAuthSyncFromDataObjectSourceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const uid = paramsData.uid;
    delete paramsData.uid;

    return this.post<IAuthSyncFromDataObjectSourceReturn>(
      `/v1/auth/data_object_sources/${uid}/sync`,
      paramsData,
      options
    );
  }

  public AuthListDataOperationSets(
    params: IAuthListDataOperationSetsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListDataOperationSetsReturn>(
      '/v1/auth/data_operation_sets',
      paramsData,
      options
    );
  }

  public AuthAddDataPermissionTemplate(
    params: IAuthAddDataPermissionTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IAuthAddDataPermissionTemplateReturn>(
      '/v1/auth/data_permission_templates',
      paramsData,
      options
    );
  }

  public AuthUpdateDataPermissionTemplate(
    params: IAuthUpdateDataPermissionTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const data_permission_template_uid =
      paramsData.data_permission_template_uid;
    delete paramsData.data_permission_template_uid;

    return this.put<IAuthUpdateDataPermissionTemplateReturn>(
      `/v1/auth/data_permission_templates/${data_permission_template_uid}`,
      paramsData,
      options
    );
  }

  public AuthCopyDataPermissionTemplate(
    params: IAuthCopyDataPermissionTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const data_permission_template_uid =
      paramsData.data_permission_template_uid;
    delete paramsData.data_permission_template_uid;

    return this.post<IAuthCopyDataPermissionTemplateReturn>(
      `/v1/auth/data_permission_templates/${data_permission_template_uid}/copy`,
      paramsData,
      options
    );
  }

  public AuthGetDataPermissionsInDataPermissionTemplate(
    params: IAuthGetDataPermissionsInDataPermissionTemplateParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const data_permission_template_uid =
      paramsData.data_permission_template_uid;
    delete paramsData.data_permission_template_uid;

    return this.get<IAuthGetDataPermissionsInDataPermissionTemplateReturn>(
      `/v1/auth/data_permission_templates/${data_permission_template_uid}/data_permissions`,
      paramsData,
      options
    );
  }

  public AuthGetStatementByDataPermissionTemplates(
    params: IAuthGetStatementByDataPermissionTemplatesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const data_permission_template_uid =
      paramsData.data_permission_template_uid;
    delete paramsData.data_permission_template_uid;

    return this.get<IAuthGetStatementByDataPermissionTemplatesReturn>(
      `/v1/auth/data_permission_templates/${data_permission_template_uid}/statements`,
      paramsData,
      options
    );
  }

  public AuthVerifyDBAccount(
    params: IAuthVerifyDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const data_permission_template_uid =
      paramsData.data_permission_template_uid;
    delete paramsData.data_permission_template_uid;

    return this.get<IAuthVerifyDBAccountReturn>(
      `/v1/auth/data_permission_templates/${data_permission_template_uid}/verify_db_account`,
      paramsData,
      options
    );
  }

  public OperateDataResourceHandle(
    params: IOperateDataResourceHandleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IOperateDataResourceHandleReturn>(
      '/v1/auth/data_resource/operation/handle',
      paramsData,
      options
    );
  }

  public AuthListDatabase(
    params: IAuthListDatabaseParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListDatabaseReturn>(
      '/v1/auth/databases',
      paramsData,
      options
    );
  }

  public AuthListOperations(
    params: IAuthListOperationsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListOperationsReturn>(
      '/v1/auth/operations',
      paramsData,
      options
    );
  }

  public AuthListService(
    params: IAuthListServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListServiceReturn>(
      '/v1/auth/services',
      paramsData,
      options
    );
  }

  public AddService(options?: AxiosRequestConfig) {
    return this.post<IAddServiceReturn>(
      '/v1/auth/services',
      undefined,
      options
    );
  }

  public AuthListBusiness(
    params: IAuthListBusinessParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListBusinessReturn>(
      '/v1/auth/services/business',
      paramsData,
      options
    );
  }

  public AddDBServicePreCheck(
    params: IAddDBServicePreCheckParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAddDBServicePreCheckReturn>(
      '/v1/auth/services/precheck/add',
      paramsData,
      options
    );
  }

  public DelDBServicePreCheck(
    params: IDelDBServicePreCheckParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IDelDBServicePreCheckReturn>(
      '/v1/auth/services/precheck/del',
      paramsData,
      options
    );
  }

  public AuthSyncService(
    params: IAuthSyncServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.put<IAuthSyncServiceReturn>(
      '/v1/auth/services/sync',
      paramsData,
      options
    );
  }

  public AuthUpdateService(
    params: IAuthUpdateServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const service_uid = paramsData.service_uid;
    delete paramsData.service_uid;

    return this.put<IAuthUpdateServiceReturn>(
      `/v1/auth/services/${service_uid}`,
      paramsData,
      options
    );
  }

  public AuthDelService(
    params: IAuthDelServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const service_uid = paramsData.service_uid;
    delete paramsData.service_uid;

    return this.delete<IAuthDelServiceReturn>(
      `/v1/auth/services/${service_uid}`,
      paramsData,
      options
    );
  }

  public AuthGetUsersFromDBService(
    params: IAuthGetUsersFromDBServiceParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const service_uid = paramsData.service_uid;
    delete paramsData.service_uid;

    return this.get<IAuthGetUsersFromDBServiceReturn>(
      `/v1/auth/services/${service_uid}/users`,
      paramsData,
      options
    );
  }

  public AuthListTable(
    params: IAuthListTableParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListTableReturn>(
      '/v1/auth/tables',
      paramsData,
      options
    );
  }

  public DelUserGroupPreCheck(
    params: IDelUserGroupPreCheckParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IDelUserGroupPreCheckReturn>(
      '/v1/auth/user_groups/precheck/del',
      paramsData,
      options
    );
  }

  public AuthListUser(
    params: IAuthListUserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListUserReturn>('/v1/auth/users', paramsData, options);
  }
}

export default new AuthService();
