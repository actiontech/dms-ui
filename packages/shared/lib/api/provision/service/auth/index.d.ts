import {
  OperateDataResourceHandleDataResourceTypeEnum,
  OperateDataResourceHandleOperationTypeEnum,
  OperateDataResourceHandleOperationTimingEnum,
  AuthListDatabaseOrderByEnum,
  AuthListOperationsOrderByEnum,
  AuthListOperationsDbTypeEnum,
  AuthListServiceOrderByEnum,
  AuthListTableOrderByEnum
} from './index.enum';

import {
  IGenericResp,
  IListDatabaseReply,
  IListOperationsReply,
  IListServiceReply,
  IListEnvironmentTagsFromDBServiceReply,
  IGetUsersFromDBServiceReply,
  IListTableReply,
  IListInternalUserReply
} from '../common.d';

export interface IOperateDataResourceHandleParams {
  data_resource_uid?: string;

  data_resource_type?: OperateDataResourceHandleDataResourceTypeEnum;

  operation_type?: OperateDataResourceHandleOperationTypeEnum;

  operation_timing?: OperateDataResourceHandleOperationTimingEnum;

  extra_params?: string;
}

export interface IOperateDataResourceHandleReturn extends IGenericResp {}

export interface IAuthListDatabaseParams {
  service_uid?: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListDatabaseOrderByEnum;

  keyword?: string;
}

export interface IAuthListDatabaseReturn extends IListDatabaseReply {}

export interface IAuthListOperationsParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListOperationsOrderByEnum;

  db_type: AuthListOperationsDbTypeEnum;

  keyword?: string;
}

export interface IAuthListOperationsReturn extends IListOperationsReply {}

export interface IAuthListServiceParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListServiceOrderByEnum;

  filter_by_environment_tag_uid?: string;

  filter_by_address?: string;

  filter_by_db_type?: string;

  filter_by_user?: string;

  filter_by_namespace?: string;

  keyword?: string;
}

export interface IAuthListServiceReturn extends IListServiceReply {}

export interface IAuthListEnvironmentTagsParams {
  namespace_uid?: string;
}

export interface IAuthListEnvironmentTagsReturn
  extends IListEnvironmentTagsFromDBServiceReply {}

export interface IAuthSyncServiceParams {
  service_uids: string[];
}

export interface IAuthSyncServiceReturn extends IGenericResp {}

export interface IAuthGetUsersFromDBServiceParams {
  service_uid: string;
}

export interface IAuthGetUsersFromDBServiceReturn
  extends IGetUsersFromDBServiceReply {}

export interface IAuthListTableParams {
  database_uid: string;

  page_size: number;

  page_index?: number;

  order_by?: AuthListTableOrderByEnum;

  keyword?: string;
}

export interface IAuthListTableReturn extends IListTableReply {}

export interface IAuthListUserParams {
  page_size: number;

  page_index?: number;

  namespace_uid?: string;
}

export interface IAuthListUserReturn extends IListInternalUserReply {}
