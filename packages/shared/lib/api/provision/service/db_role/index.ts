/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IAuthListDBRoleParams,
  IAuthListDBRoleReturn,
  IAuthAddDBRoleParams,
  IAuthAddDBRoleReturn,
  IAuthListDBRoleTipsParams,
  IAuthListDBRoleTipsReturn,
  IAuthDBRoleDetailParams,
  IAuthDBRoleDetailReturn,
  IAuthUpdateDBRoleParams,
  IAuthUpdateDBRoleReturn,
  IAuthDelDBRoleParams,
  IAuthDelDBRoleReturn
} from './index.d';

class DbRoleService extends ServiceBase {
  public AuthListDBRole(
    params: IAuthListDBRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.get<IAuthListDBRoleReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles`,
      paramsData,
      options
    );
  }

  public AuthAddDBRole(
    params: IAuthAddDBRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.post<IAuthAddDBRoleReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles`,
      paramsData,
      options
    );
  }

  public AuthListDBRoleTips(
    params: IAuthListDBRoleTipsParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    return this.get<IAuthListDBRoleTipsReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles/tips`,
      paramsData,
      options
    );
  }

  public AuthDBRoleDetail(
    params: IAuthDBRoleDetailParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    const db_role_uid = paramsData.db_role_uid;
    delete paramsData.db_role_uid;

    return this.get<IAuthDBRoleDetailReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles/${db_role_uid}`,
      paramsData,
      options
    );
  }

  public AuthUpdateDBRole(
    params: IAuthUpdateDBRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    const db_role_uid = paramsData.db_role_uid;
    delete paramsData.db_role_uid;

    return this.put<IAuthUpdateDBRoleReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles/${db_role_uid}`,
      paramsData,
      options
    );
  }

  public AuthDelDBRole(
    params: IAuthDelDBRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const project_uid = paramsData.project_uid;
    delete paramsData.project_uid;

    const db_service_uid = paramsData.db_service_uid;
    delete paramsData.db_service_uid;

    const db_role_uid = paramsData.db_role_uid;
    delete paramsData.db_role_uid;

    return this.delete<IAuthDelDBRoleReturn>(
      `/v1/auth/projects/${project_uid}/db_services/${db_service_uid}/db_roles/${db_role_uid}`,
      paramsData,
      options
    );
  }
}

export default new DbRoleService();
