/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListRolesParams,
  IListRolesReturn,
  IAddRoleParams,
  IAddRoleReturn,
  IUpdateRoleParams,
  IUpdateRoleReturn,
  IDelRoleParams,
  IDelRoleReturn
} from './index.d';

class RoleService extends ServiceBase {
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
}

export default new RoleService();
