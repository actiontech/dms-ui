/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IOperateDataResourceHandleParams,
  IOperateDataResourceHandleReturn,
  IAuthListDatabaseParams,
  IAuthListDatabaseReturn,
  IAuthListOperationsParams,
  IAuthListOperationsReturn,
  IAuthListServiceParams,
  IAuthListServiceReturn,
  IAuthListBusinessParams,
  IAuthListBusinessReturn,
  IAuthSyncServiceParams,
  IAuthSyncServiceReturn,
  IAuthGetUsersFromDBServiceParams,
  IAuthGetUsersFromDBServiceReturn,
  IAuthListTableParams,
  IAuthListTableReturn,
  IAuthListUserParams,
  IAuthListUserReturn
} from './index.d';

class AuthService extends ServiceBase {
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

  public AuthListUser(
    params: IAuthListUserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IAuthListUserReturn>('/v1/auth/users', paramsData, options);
  }
}

export default new AuthService();
