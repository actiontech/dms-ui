/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListUserGroupsParams,
  IListUserGroupsReturn,
  IAddUserGroupParams,
  IAddUserGroupReturn,
  IUpdateUserGroupParams,
  IUpdateUserGroupReturn,
  IDelUserGroupParams,
  IDelUserGroupReturn
} from './index.d';

class UserGroupService extends ServiceBase {
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
}

export default new UserGroupService();
