/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
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
  IGetUserOpPermissionReturn
} from './index.d';

class UserService extends ServiceBase {
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
}

export default new UserService();
