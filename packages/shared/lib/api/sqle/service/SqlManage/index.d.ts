import {
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterErrorPriorityEnum,
  GetSqlManageListFilterStatusEnum,
  GetSqlManageListSortFieldEnum,
  GetSqlManageListSortOrderEnum,
  exportSqlManageV1FilterPriorityEnum,
  exportSqlManageV1FilterSourceEnum,
  exportSqlManageV1FilterAuditLevelEnum,
  exportSqlManageV1FilterErrorPriorityEnum,
  exportSqlManageV1FilterStatusEnum,
  exportSqlManageV1SortOrderEnum,
  exportSqlManageRemediationV1ExportScopeEnum,
  exportSqlManageRemediationV1FilterAuditLevelEnum,
  exportSqlManageRemediationV1FilterStatusEnum,
  exportSqlManageRemediationV1FilterPriorityEnum,
  GetSqlManageListV2FilterSourceEnum,
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterErrorPriorityEnum,
  GetSqlManageListV2FilterStatusEnum,
  GetSqlManageListV2FilterPriorityEnum,
  GetSqlManageListV2SortOrderEnum,
  GetSqlManageStatisticsV2FilterSourceEnum,
  GetSqlManageStatisticsV2FilterAuditLevelEnum,
  GetSqlManageStatisticsV2FilterErrorPriorityEnum,
  GetSqlManageStatisticsV2FilterStatusEnum,
  GetSqlManageStatisticsV2FilterPriorityEnum
} from './index.enum';

import {
  IGetSqlManageListResp,
  IBatchUpdateSqlManageReq,
  IBaseRes,
  IGetSqlManageRuleTipsResp,
  IGetSqlManageRemediationResp,
  IGetSqlManageSqlAnalysisResp,
  IGetSqlManageStatisticsResp
} from '../common.d';

export interface IGetSqlManageListParams {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_name?: string;

  filter_source?: GetSqlManageListFilterSourceEnum;

  filter_audit_level?: GetSqlManageListFilterAuditLevelEnum;

  filter_error_priority?: GetSqlManageListFilterErrorPriorityEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListFilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  filter_schema_name?: string;

  filter_parse_failed?: boolean;

  sort_field?: GetSqlManageListSortFieldEnum;

  sort_order?: GetSqlManageListSortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListReturn extends IGetSqlManageListResp {}

export interface IBatchUpdateSqlManageParams extends IBatchUpdateSqlManageReq {
  project_name: string;
}

export interface IBatchUpdateSqlManageReturn extends IBaseRes {}

export interface IExportSqlManageV1Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_business?: string;

  filter_priority?: exportSqlManageV1FilterPriorityEnum;

  filter_instance_id?: string;

  filter_source?: exportSqlManageV1FilterSourceEnum;

  filter_audit_level?: exportSqlManageV1FilterAuditLevelEnum;

  filter_error_priority?: exportSqlManageV1FilterErrorPriorityEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: exportSqlManageV1FilterStatusEnum;

  filter_db_type?: string;

  filter_rule_name?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  filter_schema_name?: string;

  filter_parse_failed?: boolean;

  sort_field?: string;

  sort_order?: exportSqlManageV1SortOrderEnum;

  extra_filters?: string;

  export_column_keys?: string;
}

export interface IExportSqlManageRemediationV1Params {
  project_name: string;

  export_scope: exportSqlManageRemediationV1ExportScopeEnum;

  filter_instance_id?: string;

  instance_audit_plan_id?: string;

  audit_plan_type?: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_business?: string;

  filter_source?: string;

  filter_audit_level?: exportSqlManageRemediationV1FilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: exportSqlManageRemediationV1FilterStatusEnum;

  filter_db_type?: string;

  filter_rule_name?: string;

  filter_priority?: exportSqlManageRemediationV1FilterPriorityEnum;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  filter_schema_name?: string;

  filter_parse_failed?: boolean;

  extra_filters?: string;

  filter_list?: string;
}

export interface IGetSqlManageRuleTipsParams {
  project_name: string;
}

export interface IGetSqlManageRuleTipsReturn
  extends IGetSqlManageRuleTipsResp {}

export interface IGetSqlManageRemediationV1Params {
  project_name: string;

  sql_manage_id: string;
}

export interface IGetSqlManageRemediationV1Return
  extends IGetSqlManageRemediationResp {}

export interface IGetSqlManageSqlAnalysisV1Params {
  project_name: string;

  sql_manage_id: string;
}

export interface IGetSqlManageSqlAnalysisV1Return
  extends IGetSqlManageSqlAnalysisResp {}

export interface IGetSqlManageListV2Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  fuzzy_search_id?: string;

  filter_assignee?: string;

  filter_instance_id?: string;

  filter_source?: GetSqlManageListV2FilterSourceEnum;

  filter_audit_level?: GetSqlManageListV2FilterAuditLevelEnum;

  filter_error_priority?: GetSqlManageListV2FilterErrorPriorityEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListV2FilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  filter_business?: string;

  filter_priority?: GetSqlManageListV2FilterPriorityEnum;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  filter_schema_name?: string;

  filter_parse_failed?: boolean;

  sort_field?: string;

  sort_order?: GetSqlManageListV2SortOrderEnum;

  extra_filters?: string;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListV2Return extends IGetSqlManageListResp {}

export interface IGetSqlManageStatisticsV2Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  fuzzy_search_id?: string;

  filter_assignee?: string;

  filter_instance_id?: string;

  filter_source?: GetSqlManageStatisticsV2FilterSourceEnum;

  filter_audit_level?: GetSqlManageStatisticsV2FilterAuditLevelEnum;

  filter_error_priority?: GetSqlManageStatisticsV2FilterErrorPriorityEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageStatisticsV2FilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  filter_business?: string;

  filter_priority?: GetSqlManageStatisticsV2FilterPriorityEnum;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  filter_schema_name?: string;

  filter_parse_failed?: boolean;

  extra_filters?: string;
}

export interface IGetSqlManageStatisticsV2Return
  extends IGetSqlManageStatisticsResp {}
