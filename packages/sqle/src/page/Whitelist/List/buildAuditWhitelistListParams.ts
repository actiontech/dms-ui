import { IGetAuditWhitelistV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import {
  getAuditWhitelistV1FilterRuleScopeModeEnum,
  getAuditWhitelistV1FilterSqlSourceEnum
} from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';

export type AuditWhitelistListFilterValues = {
  filter_type?: string;
  filter_db_type_value?: string;
  filter_sql_source_value?: getAuditWhitelistV1FilterSqlSourceEnum;
  filter_rule_scope_mode?: 'all' | 'specific';
  filter_rule_name?: string;
  filter_audit_task_type?: string;
  filter_audit_task_id?: string;
  filter_created_by?: string;
  filter_created_at_from?: string;
  filter_created_at_to?: string;
};

type BuildAuditWhitelistListParamsOptions = {
  projectName: string;
  pageIndex: number;
  pageSize: number;
  globalSearchKeyword?: string;
  filters: AuditWhitelistListFilterValues;
};

const trimValue = (value?: string) => value?.trim() || undefined;

export const buildAuditWhitelistListParams = ({
  projectName,
  pageIndex,
  pageSize,
  globalSearchKeyword,
  filters
}: BuildAuditWhitelistListParamsOptions): IGetAuditWhitelistV1Params => {
  const params: IGetAuditWhitelistV1Params = {
    project_name: projectName,
    page_index: String(pageIndex),
    page_size: String(pageSize)
  };

  const fuzzyContent = trimValue(globalSearchKeyword);

  if (fuzzyContent) {
    params.fuzzy_search_content = fuzzyContent;
  }

  const filterType = trimValue(filters.filter_type);
  if (filterType) {
    params.filter_type =
      filterType as IGetAuditWhitelistV1Params['filter_type'];
  }

  const dbType = trimValue(filters.filter_db_type_value);
  if (dbType) {
    params.filter_db_type = dbType;
  }
  const filterSqlSource = filters.filter_sql_source_value;
  if (filterSqlSource) {
    params.filter_sql_source = filterSqlSource;
  }
  if (filters.filter_rule_scope_mode) {
    params.filter_rule_scope_mode =
      filters.filter_rule_scope_mode as getAuditWhitelistV1FilterRuleScopeModeEnum;
  }
  const filterRuleName = trimValue(filters.filter_rule_name);
  if (filterRuleName) {
    params.filter_rule_name = filterRuleName;
  }
  const filterAuditTaskType = trimValue(filters.filter_audit_task_type);
  if (filterAuditTaskType) {
    params.filter_audit_task_type = filterAuditTaskType;
  }
  const filterAuditTaskId = trimValue(filters.filter_audit_task_id);
  if (filterAuditTaskId) {
    params.filter_audit_task_id = filterAuditTaskId;
  }
  const filterCreatedBy = trimValue(filters.filter_created_by);
  if (filterCreatedBy) {
    params.filter_created_by = filterCreatedBy;
  }
  if (filters.filter_created_at_from) {
    params.filter_created_at_from = filters.filter_created_at_from;
  }
  if (filters.filter_created_at_to) {
    params.filter_created_at_to = filters.filter_created_at_to;
  }

  return params;
};
