import { GetSqlManageListSortFieldEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

/** Classic sort fields that always belong to SQL manage list (not source_extra). */
export const SQL_MANAGE_CLASSIC_SORT_FIELDS = [
  GetSqlManageListSortFieldEnum.first_appear_timestamp,
  GetSqlManageListSortFieldEnum.last_receive_timestamp,
  GetSqlManageListSortFieldEnum.fp_count
] as const;

export type SqlManageClassicSortField =
  (typeof SQL_MANAGE_CLASSIC_SORT_FIELDS)[number];

export const isSqlManageClassicSortField = (
  field: string | undefined | null
): field is SqlManageClassicSortField => {
  if (!field) {
    return false;
  }
  return (SQL_MANAGE_CLASSIC_SORT_FIELDS as readonly string[]).includes(field);
};

/**
 * Known static filter keys that map to GetSqlManageListV2 query params.
 * Dynamic source_extra filters must NOT be spread into those params.
 */
export const SQL_MANAGE_STATIC_FILTER_KEYS = [
  'filter_business',
  'filter_source',
  'filter_instance_id',
  'filter_schema_name',
  'filter_audit_level',
  'filter_rule_name',
  'filter_last_audit_start_time_from',
  'filter_last_audit_start_time_to',
  'filter_assignee',
  'filter_priority',
  'filter_status',
  'filter_db_type',
  'fuzzy_search_sql_fingerprint',
  'fuzzy_search_endpoint',
  'fuzzy_search_schema_name'
] as const;
