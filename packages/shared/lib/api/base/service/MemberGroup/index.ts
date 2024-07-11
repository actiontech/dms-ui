/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IListMemberGroupsParams,
  IListMemberGroupsReturn,
  IAddMemberGroupParams,
  IAddMemberGroupReturn,
  IGetMemberGroupParams,
  IGetMemberGroupReturn,
  IUpdateMemberGroupParams,
  IUpdateMemberGroupReturn,
  IDeleteMemberGroupParams,
  IDeleteMemberGroupReturn
} from './index.d';

class MemberGroupService extends ServiceBase {
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
}

export default new MemberGroupService();
