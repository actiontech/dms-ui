/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IV1LoginParams,
  IV1LoginReturn,
  IV1CreateRoleParams,
  IV1CreateRoleReturn,
  IV1DeleteRoleParams,
  IV1DeleteRoleReturn,
  IV1ListRolesParams,
  IV1ListRolesReturn,
  IV1ListRoleScopesParams,
  IV1ListRoleScopesReturn,
  IV1GetRoleParams,
  IV1GetRoleReturn,
  IV1CreateRoleScopeParams,
  IV1CreateRoleScopeReturn,
  IV1DeleteRoleScopeParams,
  IV1DeleteRoleScopeReturn,
  IV1ListExistingScopesReturn,
  IV1CreateUserParams,
  IV1CreateUserReturn,
  IV1DeleteUserParams,
  IV1DeleteUserReturn,
  IV1ListUsersParams,
  IV1ListUsersReturn,
  IV1UpdateUserPasswordParams,
  IV1UpdateUserPasswordReturn,
  IV1UpdateUserRoleParams,
  IV1UpdateUserRoleReturn,
  IV1GetUserParams,
  IV1GetUserReturn
} from './index.d';

class AuthService extends ServiceBase {
  public V1Login(params: IV1LoginParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1LoginReturn>('/v1/auth/login', paramsData, options);
  }

  public V1CreateRole(
    params: IV1CreateRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1CreateRoleReturn>(
      '/v1/auth/role/create',
      paramsData,
      options
    );
  }

  public V1DeleteRole(
    params: IV1DeleteRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1DeleteRoleReturn>(
      '/v1/auth/role/delete',
      paramsData,
      options
    );
  }

  public V1ListRoles(params: IV1ListRolesParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1ListRolesReturn>(
      '/v1/auth/role/list',
      paramsData,
      options
    );
  }

  public V1ListRoleScopes(
    params: IV1ListRoleScopesParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1ListRoleScopesReturn>(
      '/v1/auth/role/list_scopes',
      paramsData,
      options
    );
  }

  public V1GetRole(params: IV1GetRoleParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const role_id = paramsData.role_id;
    delete paramsData.role_id;

    return this.get<IV1GetRoleReturn>(
      `/v1/auth/role/${role_id}`,
      paramsData,
      options
    );
  }

  public V1CreateRoleScope(
    params: IV1CreateRoleScopeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1CreateRoleScopeReturn>(
      '/v1/auth/scope/create_role_mapping',
      paramsData,
      options
    );
  }

  public V1DeleteRoleScope(
    params: IV1DeleteRoleScopeParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1DeleteRoleScopeReturn>(
      '/v1/auth/scope/delete_role_mapping',
      paramsData,
      options
    );
  }

  public V1ListExistingScopes(options?: AxiosRequestConfig) {
    return this.get<IV1ListExistingScopesReturn>(
      '/v1/auth/scope/list',
      undefined,
      options
    );
  }

  public V1CreateUser(
    params: IV1CreateUserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1CreateUserReturn>(
      '/v1/auth/user/create',
      paramsData,
      options
    );
  }

  public V1DeleteUser(
    params: IV1DeleteUserParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1DeleteUserReturn>(
      '/v1/auth/user/delete',
      paramsData,
      options
    );
  }

  public V1ListUsers(params: IV1ListUsersParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    return this.get<IV1ListUsersReturn>(
      '/v1/auth/user/list',
      paramsData,
      options
    );
  }

  public V1UpdateUserPassword(
    params: IV1UpdateUserPasswordParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1UpdateUserPasswordReturn>(
      '/v1/auth/user/update_password',
      paramsData,
      options
    );
  }

  public V1UpdateUserRole(
    params: IV1UpdateUserRoleParams,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<IV1UpdateUserRoleReturn>(
      '/v1/auth/user/update_role',
      paramsData,
      options
    );
  }

  public V1GetUser(params: IV1GetUserParams, options?: AxiosRequestConfig) {
    const paramsData = this.cloneDeep(params);
    const user_id = paramsData.user_id;
    delete paramsData.user_id;

    return this.get<IV1GetUserReturn>(
      `/v1/auth/user/${user_id}`,
      paramsData,
      options
    );
  }
}

export default new AuthService();
