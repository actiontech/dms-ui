import {
  AuditWhitelistListFilterValues,
  buildAuditWhitelistExportParams,
  buildAuditWhitelistListParams
} from './buildAuditWhitelistListParams';
import { getAuditWhitelistV1FilterSqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';

describe('buildAuditWhitelistListParams / export', () => {
  const filters: AuditWhitelistListFilterValues = {
    filter_type: 'sql',
    filter_db_type_value: 'MySQL',
    filter_sql_source_value:
      getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record,
    filter_rule_scope_mode: 'specific',
    filter_rule_name: 'rule_a',
    filter_audit_task_type: 'sql_audit_record',
    filter_audit_task_id: 'task-1',
    filter_created_by: 'admin',
    filter_created_at_from: '2026-01-01 00:00:00',
    filter_created_at_to: '2026-01-31 23:59:59'
  };

  it('should map list filters with pagination', () => {
    expect(
      buildAuditWhitelistListParams({
        projectName: 'demo',
        pageIndex: 2,
        pageSize: 20,
        globalSearchKeyword: ' select ',
        filters
      })
    ).toEqual({
      project_name: 'demo',
      page_index: '2',
      page_size: '20',
      fuzzy_search_content: 'select',
      filter_type: 'sql',
      filter_db_type: 'MySQL',
      filter_sql_source: 'sql_audit_record',
      filter_rule_scope_mode: 'specific',
      filter_rule_name: 'rule_a',
      filter_audit_task_type: 'sql_audit_record',
      filter_audit_task_id: 'task-1',
      filter_created_by: 'admin',
      filter_created_at_from: '2026-01-01 00:00:00',
      filter_created_at_to: '2026-01-31 23:59:59'
    });
  });

  it('should build export params with same filters and without pagination', () => {
    const exportParams = buildAuditWhitelistExportParams({
      projectName: 'demo',
      globalSearchKeyword: ' select ',
      filters
    });

    expect(exportParams).toEqual({
      project_name: 'demo',
      fuzzy_search_content: 'select',
      filter_type: 'sql',
      filter_db_type: 'MySQL',
      filter_sql_source: 'sql_audit_record',
      filter_rule_scope_mode: 'specific',
      filter_rule_name: 'rule_a',
      filter_audit_task_type: 'sql_audit_record',
      filter_audit_task_id: 'task-1',
      filter_created_by: 'admin',
      filter_created_at_from: '2026-01-01 00:00:00',
      filter_created_at_to: '2026-01-31 23:59:59'
    });
    expect(exportParams).not.toHaveProperty('page_index');
    expect(exportParams).not.toHaveProperty('page_size');
  });
});
