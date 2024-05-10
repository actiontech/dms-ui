import {
  AuthListDBAccountOrderByEnum,
  AuthListDBAccountFilterByStatusEnum
} from './index.enum';

import {
  IListDBAccountReply,
  IAddDBAccount,
  IAddDBAccountReply,
  IDBAccount,
  IDataPermission,
  IGetStatementsReply,
  IDBAccountBody,
  IGenericResp,
  IGetDBAccountReply,
  IDiscoveryDBAccountReply
} from '../common.d';

export interface IAuthListDBAccountParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListDBAccountOrderByEnum;

  project_uid: string;

  filter_by_db_service?: string;

  filter_by_user?: string;

  filter_by_expired_time_from?: number;

  filter_by_expired_time_to?: number;

  filter_by_status?: AuthListDBAccountFilterByStatusEnum;

  filter_by_password_managed?: boolean;

  filter_by_used_by_sql_workbench?: boolean;

  fuzzy_keyword?: string;
}

export interface IAuthListDBAccountReturn extends IListDBAccountReply {}

export interface IAuthAddDBAccountParams {
  project_uid: string;

  db_account?: IAddDBAccount;
}

export interface IAuthAddDBAccountReturn extends IAddDBAccountReply {}

export interface IAuthGetStatementParams {
  project_uid: string;

  db_service_uid: string;

  db_accounts: IDBAccount[];

  data_permissions: IDataPermission[];
}

export interface IAuthGetStatementReturn extends IGetStatementsReply {}

export interface IAuthSyncDBAccountParams {
  project_uid: string;

  db_service_uid: string;

  accounts?: IDBAccountBody[];
}

export interface IAuthSyncDBAccountReturn extends IGenericResp {}

export interface IAuthDelDBAccountParams {
  project_uid: string;

  db_account_uid: string;
}

export interface IAuthDelDBAccountReturn extends IGenericResp {}

export interface IAuthGetDBAccountParams {
  project_uid: string;

  db_account_uid: string;
}

export interface IAuthGetDBAccountReturn extends IGetDBAccountReply {}

export interface IAuthDiscoveryDBAccountParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IAuthDiscoveryDBAccountReturn
  extends IDiscoveryDBAccountReply {}
