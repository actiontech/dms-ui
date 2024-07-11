import { ListMembersOrderByEnum } from './index.enum';

import {
  IListMemberReply,
  IAddMemberReq,
  IAddMemberReply,
  IListMembersForInternalReply,
  IListMemberTipsReply,
  IUpdateMemberReq,
  IGenericResp
} from '../common.d';

export interface IListMembersParams {
  page_size: number;

  page_index?: number;

  order_by?: ListMembersOrderByEnum;

  filter_by_user_uid?: string;

  project_uid: string;
}

export interface IListMembersReturn extends IListMemberReply {}

export interface IAddMemberParams extends IAddMemberReq {
  project_uid: string;
}

export interface IAddMemberReturn extends IAddMemberReply {}

export interface IListMembersForInternalParams {
  page_size: number;

  page_index?: number;

  project_uid: string;
}

export interface IListMembersForInternalReturn
  extends IListMembersForInternalReply {}

export interface IListMemberTipsParams {
  project_uid: string;
}

export interface IListMemberTipsReturn extends IListMemberTipsReply {}

export interface IUpdateMemberParams extends IUpdateMemberReq {
  project_uid: string;

  member_uid: string;
}

export interface IUpdateMemberReturn extends IGenericResp {}

export interface IDelMemberParams {
  project_uid: string;

  member_uid: string;
}

export interface IDelMemberReturn extends IGenericResp {}
