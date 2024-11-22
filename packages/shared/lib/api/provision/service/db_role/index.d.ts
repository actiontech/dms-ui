import { AuthListDBRoleOrderByEnum } from './index.enum';

import {
  IListDBRoleReply,
  IAddDBRole,
  IAddDBRoleReply,
  IListDBRoleTipsReply,
  IDBRoleDetailReply,
  IUpdateDBRole,
  IUpdateDBRoleReply,
  IGenericResp
} from '../common.d';

export interface IAuthListDBRoleParams {
  page_size: number;

  page_index?: number;

  project_uid: string;

  db_service_uid: string;

  order_by?: AuthListDBRoleOrderByEnum;

  filter_by_name?: string;
}

export interface IAuthListDBRoleReturn extends IListDBRoleReply {}

export interface IAuthAddDBRoleParams {
  project_uid: string;

  db_service_uid: string;

  db_role?: IAddDBRole;
}

export interface IAuthAddDBRoleReturn extends IAddDBRoleReply {}

export interface IAuthListDBRoleTipsParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IAuthListDBRoleTipsReturn extends IListDBRoleTipsReply {}

export interface IAuthDBRoleDetailParams {
  project_uid: string;

  db_service_uid: string;

  db_role_uid: string;
}

export interface IAuthDBRoleDetailReturn extends IDBRoleDetailReply {}

export interface IAuthUpdateDBRoleParams {
  project_uid: string;

  db_service_uid: string;

  db_role_uid: string;

  db_role?: IUpdateDBRole;
}

export interface IAuthUpdateDBRoleReturn extends IUpdateDBRoleReply {}

export interface IAuthDelDBRoleParams {
  project_uid: string;

  db_service_uid: string;

  db_role_uid: string;
}

export interface IAuthDelDBRoleReturn extends IGenericResp {}
