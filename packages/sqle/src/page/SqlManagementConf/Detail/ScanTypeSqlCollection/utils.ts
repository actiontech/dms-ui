import {
  IAuditResult,
  IAuditPlanSQLHeadV1,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';

export const PENDING = 'pending';
export const AUDITED = 'audited';

const AUDIT_STATUS_FIELD = 'audit_status';
const AUDIT_RESULTS_FIELD = 'audit_results';
const FIRST_AUDIT_RESULTS_FIELD = 'first_audit_results';
const PRIORITY_FIELD = 'priority';

/**
 * 解析动态表行中的 JSON 数组字段：兼容字符串(JSON)、双重编码字符串、数组以及空值。
 */
export const parseJsonArrayField = <T>(raw?: unknown): T[] => {
  if (raw === undefined || raw === null || raw === '' || raw === 'null') {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw as T[];
  }
  if (typeof raw !== 'string') {
    return [];
  }
  try {
    let parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export const parseAuditResult = (raw?: unknown): IAuditResult[] =>
  parseJsonArrayField<IAuditResult>(raw);

/**
 * 智能扫描详情特例：例外规则仍留在 `audit_results` 中，用 `is_exempted` 标记，
 * 不会拆到 `skipped_by_rule_exception`（与 SQL 管控 / 工单不同）。
 *
 * 真实返回示例（audit_results JSON）：
 * [
 *   { "level":"error", "message":"表已存在", "rule_name":"" },
 *   { "level":"error", "message":"...", "rule_name":"ddl_check_table_without_if_not_exists" },
 *   { "level":"error", "message":"...", "rule_name":"ddl_check_column_without_default",
 *     "is_exempted":true, "exception_id":4 }
 * ]
 */
export type ScanAuditResultItem = IAuditResult & {
  is_exempted?: boolean;
  desc?: string;
  exception_id?: number;
  created_by?: string;
  created_at?: string;
};

export const parseScanAuditResult = (raw?: unknown): ScanAuditResultItem[] =>
  parseJsonArrayField<ScanAuditResultItem>(raw);

/**
 * 将智能扫描 `audit_results` 按 `is_exempted === true` 拆成活跃命中与例外项。
 * 例外项映射为 `ISkippedByRuleExceptionItem`，以便复用通用摘要 / ReportDrawer；
 * 数据来源仍是 audit_results，不是 skipped_by_rule_exception。
 *
 * - 仅活跃命中 → 展示等级 icon 汇总
 * - 仅例外项 → 展示「审核SQL例外」
 * - 混合 → 汇总只统计活跃命中，例外在详情抽屉中单独展示
 */
export const splitScanAuditResultsByExemption = (
  auditResults: ScanAuditResultItem[] = []
): {
  active: IAuditResult[];
  exempted: ISkippedByRuleExceptionItem[];
} => {
  const active: IAuditResult[] = [];
  const exempted: ISkippedByRuleExceptionItem[] = [];

  auditResults.forEach((item) => {
    if (item.is_exempted === true) {
      exempted.push({
        rule_name: item.rule_name,
        level: item.level,
        message: item.message,
        desc: item.desc,
        exception_id: item.exception_id,
        created_by: item.created_by,
        created_at: item.created_at
      });
      return;
    }

    active.push({
      db_type: item.db_type,
      level: item.level,
      message: item.message,
      rule_name: item.rule_name
    });
  });

  return { active, exempted };
};

export type AuditColumnLabels = {
  auditStatus: string;
  firstAuditResult: string;
  currentAuditResult: string;
};

/**
 * 在后端返回的 head 中注入 `audit_status` 列，并按以下顺序排列：
 *   ... → audit_status → priority → first_audit_results → audit_results → ...
 * 即：保证 `audit_status` 出现在 `priority` 之前；若 `priority` 不存在，则
 * 退化为出现在 `first_audit_results` / `audit_results` 之前。
 *
 * 同时统一覆盖审核结果列标题，避免后端返回的旧文案。
 */
export const buildTableHeadWithAuditStatus = (
  head: IAuditPlanSQLHeadV1[] | undefined,
  labels: AuditColumnLabels
): IAuditPlanSQLHeadV1[] => {
  if (!head?.length) {
    return [];
  }

  const withoutAuditStatus = head
    .filter((item) => item.field_name !== AUDIT_STATUS_FIELD)
    .map<IAuditPlanSQLHeadV1>((item) => {
      if (item.field_name === FIRST_AUDIT_RESULTS_FIELD) {
        return { ...item, desc: labels.firstAuditResult };
      }
      if (item.field_name === AUDIT_RESULTS_FIELD) {
        return { ...item, desc: labels.currentAuditResult };
      }
      return item;
    });

  const auditStatusColumn: IAuditPlanSQLHeadV1 = {
    field_name: AUDIT_STATUS_FIELD,
    desc: labels.auditStatus,
    sortable: false
  };

  const priorityIndex = withoutAuditStatus.findIndex(
    (item) => item.field_name === PRIORITY_FIELD
  );
  const firstAuditResultsIndex = withoutAuditStatus.findIndex(
    (item) => item.field_name === FIRST_AUDIT_RESULTS_FIELD
  );
  const auditResultsIndex = withoutAuditStatus.findIndex(
    (item) => item.field_name === AUDIT_RESULTS_FIELD
  );
  const insertBeforeIndex =
    priorityIndex !== -1
      ? priorityIndex
      : firstAuditResultsIndex !== -1
      ? firstAuditResultsIndex
      : auditResultsIndex;

  if (insertBeforeIndex === -1) {
    return withoutAuditStatus;
  }

  return [
    ...withoutAuditStatus.slice(0, insertBeforeIndex),
    auditStatusColumn,
    ...withoutAuditStatus.slice(insertBeforeIndex)
  ];
};
