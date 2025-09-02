/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuthListDBAccountParams,
  IAuthListDBAccountReturn,
  IAuthBatchUpdateDBAccountPasswordParams,
  IAuthBatchUpdateDBAccountPasswordReturn,
  IAuthAddDBAccountParams,
  IAuthAddDBAccountReturn,
  IAuthDiscoveryDBAccountParams,
  IAuthDiscoveryDBAccountReturn,
  IAuthSyncDBAccountParams,
  IAuthSyncDBAccountReturn,
  IAuthGetStatementParams,
  IAuthGetStatementReturn,
  IAuthGetAccountStaticsParams,
  IAuthGetAccountStaticsReturn,
  IAuthGetDBAccountParams,
  IAuthGetDBAccountReturn,
  IAuthUpdateDBAccountParams,
  IAuthUpdateDBAccountReturn,
  IAuthDelDBAccountParams,
  IAuthDelDBAccountReturn
} from './index.d';

class DbAccountService extends ServiceBase {
  public AuthListDBAccount(
    params: IAuthListDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IAuthListDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts`,
      paramsData,
      options
    );
  }

  public AuthBatchUpdateDBAccountPassword(
    params: IAuthBatchUpdateDBAccountPasswordParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IAuthBatchUpdateDBAccountPasswordReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts`,
      paramsData,
      options
    );
  }

  public AuthAddDBAccount(
    params: IAuthAddDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.post<IAuthAddDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts`,
      paramsData,
      options
    );
  }

  public AuthDiscoveryDBAccount(
    params: IAuthDiscoveryDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.get<IAuthDiscoveryDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/db_service/${db_service_uid}`,
      paramsData,
      options
    );
  }

  public AuthSyncDBAccount(
    params: IAuthSyncDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.post<IAuthSyncDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/db_service/${db_service_uid}/sync`,
      paramsData,
      options
    );
  }

  public AuthGetStatement(
    params: IAuthGetStatementParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.put<IAuthGetStatementReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/statements`,
      paramsData,
      options
    );
  }

  public AuthGetAccountStatics(
    params: IAuthGetAccountStaticsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    return this.get<IAuthGetAccountStaticsReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/statics`,
      paramsData,
      options
    );
  }

  public AuthGetDBAccount(
    params: IAuthGetDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_account_uid = paramsData.db_account_uid;
    delete paramsData.db_account_uid;

    return this.get<IAuthGetDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/${db_account_uid}`,
      paramsData,
      options
    );
  }

  public AuthUpdateDBAccount(
    params: IAuthUpdateDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_account_uid = paramsData.db_account_uid;
    delete paramsData.db_account_uid;

    return this.put<IAuthUpdateDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/${db_account_uid}`,
      paramsData,
      options
    );
  }

  public AuthDelDBAccount(
    params: IAuthDelDBAccountParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_account_uid = paramsData.db_account_uid;
    delete paramsData.db_account_uid;

    return this.delete<IAuthDelDBAccountReturn>(
      `/v1/auth/projects/${project_uid}/db_accounts/${db_account_uid}`,
      paramsData,
      options
    );
  }
}

export default new DbAccountService();
