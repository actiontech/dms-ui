/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
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
  IDelMemberReturn
} from './index.d';

class MemberService extends ServiceBase {
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
}

export default new MemberService();
