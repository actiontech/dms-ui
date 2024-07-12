import { ListUserGroupsOrderByEnum } from './index.enum';

import {
  IListUserGroupReply,
  IAddUserGroupReq,
  IAddUserGroupReply,
  IUpdateUserGroupReq,
  IGenericResp
} from '../common.d';

export interface IListUserGroupsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListUserGroupsOrderByEnum;

  filter_by_name?: string;
}

export interface IListUserGroupsReturn extends IListUserGroupReply {}

export interface IAddUserGroupParams extends IAddUserGroupReq {}

export interface IAddUserGroupReturn extends IAddUserGroupReply {}

export interface IUpdateUserGroupParams extends IUpdateUserGroupReq {
  user_group_uid: string;
}

export interface IUpdateUserGroupReturn extends IGenericResp {}

export interface IDelUserGroupParams {
  user_group_uid: string;
}

export interface IDelUserGroupReturn extends IGenericResp {}
