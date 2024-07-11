import { ListMemberGroupsOrderByEnum } from './index.enum';

import {
  IListMemberGroupsReply,
  IAddMemberGroupReq,
  IAddMemberGroupReply,
  IGetMemberGroupReply,
  IUpdateMemberGroupReq,
  IGenericResp
} from '../common.d';

export interface IListMemberGroupsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListMemberGroupsOrderByEnum;

  filter_by_name?: string;

  project_uid: string;
}

export interface IListMemberGroupsReturn extends IListMemberGroupsReply {}

export interface IAddMemberGroupParams extends IAddMemberGroupReq {
  project_uid: string;
}

export interface IAddMemberGroupReturn extends IAddMemberGroupReply {}

export interface IGetMemberGroupParams {
  member_group_uid: string;

  project_uid: string;
}

export interface IGetMemberGroupReturn extends IGetMemberGroupReply {}

export interface IUpdateMemberGroupParams extends IUpdateMemberGroupReq {
  project_uid: string;

  member_group_uid: string;
}

export interface IUpdateMemberGroupReturn extends IGenericResp {}

export interface IDeleteMemberGroupParams {
  project_uid: string;

  member_group_uid: string;
}

export interface IDeleteMemberGroupReturn extends IGenericResp {}
