import {
  AuthListDBAccountOrderByEnum,
  AuthListDBAccountFilterByStatusEnum
} from './index.enum';

import {
  IListDBAccountReply,
  IBatchUpdateDBAccountPassword,
  IGenericResp,
  IAddDBAccount,
  IAddDBAccountReply,
  IDiscoveryDBAccountReply,
  IDBAccountBody,
  IGetStatement,
  IGetStatementsReply,
  IAuthGetAccountStaticsReply,
  IGetDBAccountReply,
  IUpdateDBAccount
} from '../common.d';

export interface IAuthListDBAccountParams {
  page_size: number;

  page_index?: number;

  order_by?: AuthListDBAccountOrderByEnum;

  project_uid: string;

  filter_by_db_service?: string;

  filter_by_user?: string;

  filter_by_policy?: string;

  filter_by_expired_time_from?: string;

  filter_by_expired_time_to?: string;

  filter_by_status?: AuthListDBAccountFilterByStatusEnum;

  filter_by_password_managed?: boolean;

  fuzzy_keyword?: string;
}

export interface IAuthListDBAccountReturn extends IListDBAccountReply {}

export interface IAuthBatchUpdateDBAccountPasswordParams {
  project_uid: string;

  db_account_password?: IBatchUpdateDBAccountPassword;
}

export interface IAuthBatchUpdateDBAccountPasswordReturn extends IGenericResp {}

export interface IAuthAddDBAccountParams {
  project_uid: string;

  db_account?: IAddDBAccount;
}

export interface IAuthAddDBAccountReturn extends IAddDBAccountReply {}

export interface IAuthDiscoveryDBAccountParams {
  project_uid: string;

  db_service_uid: string;
}

export interface IAuthDiscoveryDBAccountReturn
  extends IDiscoveryDBAccountReply {}

export interface IAuthSyncDBAccountParams {
  project_uid: string;

  db_service_uid: string;

  accounts?: IDBAccountBody[];
}

export interface IAuthSyncDBAccountReturn extends IGenericResp {}

export interface IAuthGetStatementParams {
  project_uid: string;

  db_accounts?: IGetStatement;
}

export interface IAuthGetStatementReturn extends IGetStatementsReply {}

export interface IAuthGetAccountStaticsParams {
  project_uid: string;
}

export interface IAuthGetAccountStaticsReturn
  extends IAuthGetAccountStaticsReply {}

export interface IAuthGetDBAccountParams {
  project_uid: string;

  db_account_uid: string;
}

export interface IAuthGetDBAccountReturn extends IGetDBAccountReply {}

export interface IAuthUpdateDBAccountParams {
  project_uid: string;

  db_account_uid: string;

  db_account?: IUpdateDBAccount;
}

export interface IAuthUpdateDBAccountReturn extends IGenericResp {}

export interface IAuthDelDBAccountParams {
  project_uid: string;

  db_account_uid: string;

  detach_from_database?: boolean;
}

export interface IAuthDelDBAccountReturn extends IGenericResp {}
