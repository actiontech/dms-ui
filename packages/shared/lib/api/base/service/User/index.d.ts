import { ListUsersOrderByEnum } from './index.enum';

import {
  IListUserReply,
  IUpdateCurrentUserReq,
  IGenericResp,
  IAddUserReq,
  IAddUserReply,
  IGenAccessToken,
  IGenAccessTokenReply,
  IGetUserReply,
  IUpdateUserReq,
  IUserOpPermission,
  IGetUserOpPermissionReply
} from '../common.d';

export interface IListUsersParams {
  page_size: number;

  page_index?: number;

  order_by?: ListUsersOrderByEnum;

  filter_by_name?: string;

  filter_by_uids?: string;

  filter_del_user?: boolean;
}

export interface IListUsersReturn extends IListUserReply {}

export interface IUpdateCurrentUserParams extends IUpdateCurrentUserReq {}

export interface IUpdateCurrentUserReturn extends IGenericResp {}

export interface IAddUserParams extends IAddUserReq {}

export interface IAddUserReturn extends IAddUserReply {}

export interface IGenAccessTokenParams extends IGenAccessToken {}

export interface IGenAccessTokenReturn extends IGenAccessTokenReply {}

export interface IGetUserParams {
  user_uid: string;
}

export interface IGetUserReturn extends IGetUserReply {}

export interface IUpdateUserParams extends IUpdateUserReq {
  user_uid: string;
}

export interface IUpdateUserReturn extends IGenericResp {}

export interface IDelUserParams {
  user_uid: string;
}

export interface IDelUserReturn extends IGenericResp {}

export interface IGetUserOpPermissionParams extends IUserOpPermission {
  user_uid: string;
}

export interface IGetUserOpPermissionReturn extends IGetUserOpPermissionReply {}
