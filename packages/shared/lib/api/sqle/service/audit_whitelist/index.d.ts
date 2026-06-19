import {
  IGetAuditWhitelistResV1,
  ICreateAuditWhitelistReqV1,
  IBaseRes,
  IUpdateAuditWhitelistReqV1,
  ISQLRuleExceptionResV1,
  ICreateSQLRuleExceptionReqV1,
  IGetSQLRuleExceptionResV1
} from '../common.d';

export interface IGetAuditWhitelistV1Params {
  project_name: string;

  fuzzy_search_value?: string;

  filter_match_type?: string;

  page_index: string;

  page_size: string;
}

export interface IGetAuditWhitelistV1Return extends IGetAuditWhitelistResV1 {}

export interface ICreateAuditWhitelistV1Params
  extends ICreateAuditWhitelistReqV1 {
  project_name: string;
}

export interface ICreateAuditWhitelistV1Return extends IBaseRes {}

export interface IDeleteAuditWhitelistByIdV1Params {
  project_name: string;

  audit_whitelist_id: string;
}

export interface IDeleteAuditWhitelistByIdV1Return extends IBaseRes {}

export interface IUpdateAuditWhitelistByIdV1Params
  extends IUpdateAuditWhitelistReqV1 {
  project_name: string;

  audit_whitelist_id: string;
}

export interface IUpdateAuditWhitelistByIdV1Return extends IBaseRes {}

export interface ICreateSQLRuleExceptionV1Params
  extends ICreateSQLRuleExceptionReqV1 {
  project_name: string;
}

export interface ICreateSQLRuleExceptionV1Return extends IBaseRes {
  data?: ISQLRuleExceptionResV1;
}

export interface IGetSQLRuleExceptionV1Params {
  project_name: string;

  fuzzy_search_value?: string;

  filter_instance_id?: string;

  filter_rule_name?: string;

  filter_created_by?: string;

  filter_created_time_from?: string;

  filter_created_time_to?: string;

  filter_sql_fingerprint?: string;

  page_index: string;

  page_size: string;
}

export interface IGetSQLRuleExceptionV1Return
  extends IGetSQLRuleExceptionResV1 {}

export interface IDeleteSQLRuleExceptionV1Params {
  project_name: string;

  sql_rule_exception_id: string;
}

export interface IDeleteSQLRuleExceptionV1Return extends IBaseRes {}
