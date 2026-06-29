import {
  getBlacklistV1FilterTypeEnum,
  getBlacklistV1FilterRuleScopeModeEnum
} from './index.enum';

import {
  IGetBlacklistResV1,
  ICreateBlacklistReqV1,
  ICreateBlacklistResV1,
  IGetBlacklistDetailResV1,
  IBaseRes,
  IUpdateBlacklistReqV1
} from '../common.d';

export interface IGetBlacklistV1Params {
  project_name: string;

  filter_type?: getBlacklistV1FilterTypeEnum;

  fuzzy_search_content?: string;

  filter_rule_scope_mode?: getBlacklistV1FilterRuleScopeModeEnum;

  filter_rule_name?: string;

  filter_audit_task_type?: string;

  filter_audit_task_id?: string;

  filter_created_by?: string;

  filter_created_at_from?: string;

  filter_created_at_to?: string;

  page_index: string;

  page_size: string;
}

export interface IGetBlacklistV1Return extends IGetBlacklistResV1 {}

export interface ICreateBlacklistV1Params extends ICreateBlacklistReqV1 {
  project_name: string;
}

export interface ICreateBlacklistV1Return extends ICreateBlacklistResV1 {}

export interface IGetBlacklistByIDV1Params {
  project_name: string;

  blacklist_id: string;
}

export interface IGetBlacklistByIDV1Return extends IGetBlacklistDetailResV1 {}

export interface IDeleteBlackListParams {
  project_name: string;

  blacklist_id: string;
}

export interface IDeleteBlackListReturn extends IBaseRes {}

export interface IUpdateBlacklistV1Params extends IUpdateBlacklistReqV1 {
  project_name: string;

  blacklist_id: string;
}

export interface IUpdateBlacklistV1Return extends IBaseRes {}
