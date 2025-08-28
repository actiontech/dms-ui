import {
  GetGlobalSqlManageListFilterProjectPriorityEnum,
  GetGlobalSqlManageStatisticsFilterProjectPriorityEnum,
  GetSqlManageListFilterSourceEnum,
  GetSqlManageListFilterAuditLevelEnum,
  GetSqlManageListFilterStatusEnum,
  GetSqlManageListSortFieldEnum,
  GetSqlManageListSortOrderEnum,
  exportSqlManageV1FilterPriorityEnum,
  exportSqlManageV1FilterSourceEnum,
  exportSqlManageV1FilterAuditLevelEnum,
  exportSqlManageV1FilterStatusEnum,
  exportSqlManageV1SortFieldEnum,
  exportSqlManageV1SortOrderEnum,
  GetSqlManageListV2FilterSourceEnum,
  GetSqlManageListV2FilterAuditLevelEnum,
  GetSqlManageListV2FilterStatusEnum,
  GetSqlManageListV2FilterPriorityEnum,
  GetSqlManageListV2SortFieldEnum,
  GetSqlManageListV2SortOrderEnum,
  exportSqlManageV2FilterPriorityEnum,
  exportSqlManageV2FilterSourceEnum,
  exportSqlManageV2FilterAuditLevelEnum,
  exportSqlManageV2FilterStatusEnum,
  exportSqlManageV2SortFieldEnum,
  exportSqlManageV2SortOrderEnum,
  GetSqlManageListV3FilterSourceEnum,
  GetSqlManageListV3FilterAuditLevelEnum,
  GetSqlManageListV3FilterStatusEnum,
  GetSqlManageListV3FilterPriorityEnum,
  GetSqlManageListV3SortFieldEnum,
  GetSqlManageListV3SortOrderEnum
} from './index.enum';

import {
  IGetGlobalSqlManageListResp,
  IGetGlobalSqlManageStatisticsResp,
  IGetSqlManageListResp,
  IGetAbnormalAuditPlanInstancesResp,
  IBatchUpdateSqlManageReq,
  IBaseRes,
  IGetSqlManageRuleTipsResp,
  ISqlManageCodingReq,
  IPostSqlManageCodingResp,
  IGetSqlManageSqlAnalysisResp,
  ISqlManageAnalysisChartResp
} from '../common.d';

export interface IGetGlobalSqlManageListParams {
  filter_project_uid?: string;

  filter_instance_id?: string;

  filter_project_priority?: GetGlobalSqlManageListFilterProjectPriorityEnum;

  page_index: number;

  page_size: number;
}

export interface IGetGlobalSqlManageListReturn
  extends IGetGlobalSqlManageListResp {}

export interface IGetGlobalSqlManageStatisticsParams {
  filter_project_uid?: string;

  filter_instance_id?: string;

  filter_project_priority?: GetGlobalSqlManageStatisticsFilterProjectPriorityEnum;
}

export interface IGetGlobalSqlManageStatisticsReturn
  extends IGetGlobalSqlManageStatisticsResp {}

export interface IGetSqlManageListParams {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_name?: string;

  filter_source?: GetSqlManageListFilterSourceEnum;

  filter_audit_level?: GetSqlManageListFilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListFilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  sort_field?: GetSqlManageListSortFieldEnum;

  sort_order?: GetSqlManageListSortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListReturn extends IGetSqlManageListResp {}

export interface IGetAbnormalInstanceAuditPlansV1Params {
  project_name: string;
}

export interface IGetAbnormalInstanceAuditPlansV1Return
  extends IGetAbnormalAuditPlanInstancesResp {}

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

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: exportSqlManageV1FilterStatusEnum;

  filter_db_type?: string;

  filter_rule_name?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  sort_field?: exportSqlManageV1SortFieldEnum;

  sort_order?: exportSqlManageV1SortOrderEnum;
}

export interface IGetSqlManageRuleTipsParams {
  project_name: string;
}

export interface IGetSqlManageRuleTipsReturn
  extends IGetSqlManageRuleTipsResp {}

export interface ISendSqlManageParams extends ISqlManageCodingReq {
  project_name: string;
}

export interface ISendSqlManageReturn extends IPostSqlManageCodingResp {}

export interface IGetSqlManageSqlAnalysisV1Params {
  project_name: string;

  sql_manage_id: string;

  affectRowsEnabled?: boolean;
}

export interface IGetSqlManageSqlAnalysisV1Return
  extends IGetSqlManageSqlAnalysisResp {}

export interface IGetSqlManageSqlAnalysisChartV1Params {
  project_name: string;

  sql_manage_id: string;

  latest_point_enabled: boolean;

  start_time: string;

  end_time: string;

  metric_name: string;
}

export interface IGetSqlManageSqlAnalysisChartV1Return
  extends ISqlManageAnalysisChartResp {}

export interface IGetSqlManageListV2Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_id?: string;

  filter_source?: GetSqlManageListV2FilterSourceEnum;

  filter_audit_level?: GetSqlManageListV2FilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListV2FilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  filter_business?: string;

  filter_by_environment_tag?: string;

  filter_priority?: GetSqlManageListV2FilterPriorityEnum;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  sort_field?: GetSqlManageListV2SortFieldEnum;

  sort_order?: GetSqlManageListV2SortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListV2Return extends IGetSqlManageListResp {}

export interface IExportSqlManageV2Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_by_environment_tag?: string;

  filter_priority?: exportSqlManageV2FilterPriorityEnum;

  filter_instance_id?: string;

  filter_source?: exportSqlManageV2FilterSourceEnum;

  filter_audit_level?: exportSqlManageV2FilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: exportSqlManageV2FilterStatusEnum;

  filter_db_type?: string;

  filter_rule_name?: string;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  sort_field?: exportSqlManageV2SortFieldEnum;

  sort_order?: exportSqlManageV2SortOrderEnum;
}

export interface IGetSqlManageListV3Params {
  project_name: string;

  fuzzy_search_sql_fingerprint?: string;

  filter_assignee?: string;

  filter_instance_id?: string;

  filter_source?: GetSqlManageListV3FilterSourceEnum;

  filter_audit_level?: GetSqlManageListV3FilterAuditLevelEnum;

  filter_last_audit_start_time_from?: string;

  filter_last_audit_start_time_to?: string;

  filter_status?: GetSqlManageListV3FilterStatusEnum;

  filter_rule_name?: string;

  filter_db_type?: string;

  filter_by_environment_tag?: string;

  filter_priority?: GetSqlManageListV3FilterPriorityEnum;

  fuzzy_search_endpoint?: string;

  fuzzy_search_schema_name?: string;

  sort_field?: GetSqlManageListV3SortFieldEnum;

  sort_order?: GetSqlManageListV3SortOrderEnum;

  page_index: number;

  page_size: number;
}

export interface IGetSqlManageListV3Return extends IGetSqlManageListResp {}
