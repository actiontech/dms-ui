import { ListRolesOrderByEnum } from './index.enum';

import {
  IListRoleReply,
  IAddRoleReq,
  IAddRoleReply,
  IUpdateRoleReq,
  IGenericResp
} from '../common.d';

export interface IListRolesParams {
  page_size: number;

  page_index?: number;

  order_by?: ListRolesOrderByEnum;

  filter_by_name?: string;
}

export interface IListRolesReturn extends IListRoleReply {}

export interface IAddRoleParams extends IAddRoleReq {}

export interface IAddRoleReturn extends IAddRoleReply {}

export interface IUpdateRoleParams extends IUpdateRoleReq {
  role_uid: string;
}

export interface IUpdateRoleReturn extends IGenericResp {}

export interface IDelRoleParams {
  role_uid: string;
}

export interface IDelRoleReturn extends IGenericResp {}
