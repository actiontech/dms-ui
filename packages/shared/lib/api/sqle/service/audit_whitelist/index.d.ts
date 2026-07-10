import {
  getAuditWhitelistV1FilterTypeEnum,
  getAuditWhitelistV1FilterRuleScopeModeEnum,
  getAuditWhitelistV1FilterSqlSourceEnum
} from './index.enum';

import {
  IGetAuditWhitelistResV1,
  ICreateAuditWhitelistReqV1,
  ICreateAuditWhitelistResV1,
  IGetAuditWhitelistDetailResV1,
  IBaseRes,
  IUpdateAuditWhitelistReqV1
} from '../common.d';

export interface IGetAuditWhitelistV1Params {
  project_name: string;

  filter_type?: getAuditWhitelistV1FilterTypeEnum;

  fuzzy_search_content?: string;

  filter_db_type?: string;

  filter_rule_scope_mode?: getAuditWhitelistV1FilterRuleScopeModeEnum;

  filter_rule_name?: string;

  filter_audit_task_type?: string;

  filter_audit_task_id?: string;

  filter_sql_source?: getAuditWhitelistV1FilterSqlSourceEnum;

  filter_created_by?: string;

  filter_created_at_from?: string;

  filter_created_at_to?: string;

  page_index: string;

  page_size: string;
}

export interface IGetAuditWhitelistV1Return extends IGetAuditWhitelistResV1 {}

export interface ICreateAuditWhitelistV1Params extends ICreateAuditWhitelistReqV1 {
  project_name: string;
}

export interface ICreateAuditWhitelistV1Return extends ICreateAuditWhitelistResV1 {}

export interface IGetAuditWhitelistByIDV1Params {
  project_name: string;

  audit_whitelist_id: string;
}

export interface IGetAuditWhitelistByIDV1Return extends IGetAuditWhitelistDetailResV1 {}

export interface IDeleteAuditWhitelistByIdV1Params {
  project_name: string;

  audit_whitelist_id: string;
}

export interface IDeleteAuditWhitelistByIdV1Return extends IBaseRes {}

export interface IUpdateAuditWhitelistByIdV1Params extends IUpdateAuditWhitelistReqV1 {
  project_name: string;

  audit_whitelist_id: string;
}

export interface IUpdateAuditWhitelistByIdV1Return extends IBaseRes {}
