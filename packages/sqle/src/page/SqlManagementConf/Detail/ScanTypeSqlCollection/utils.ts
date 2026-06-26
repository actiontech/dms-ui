import {
  IAuditResult,
  IAuditPlanSQLHeadV1
} from '@actiontech/shared/lib/api/sqle/service/common';

export const BEING_AUDITED = 'being_audited';
export const AUDITED = 'audited';

const AUDIT_STATUS_FIELD = 'audit_status';
const AUDIT_RESULTS_FIELD = 'audit_results';
const FIRST_AUDIT_RESULTS_FIELD = 'first_audit_results';
const PRIORITY_FIELD = 'priority';

/**
 * 通用的审核结果解析函数：兼容字符串(JSON)、双重编码字符串、数组以及空值。
 */
export const parseAuditResult = (raw?: unknown): IAuditResult[] => {
  if (raw === undefined || raw === null || raw === '' || raw === 'null') {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw as IAuditResult[];
  }
  if (typeof raw !== 'string') {
    return [];
  }
  try {
    let parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return Array.isArray(parsed) ? (parsed as IAuditResult[]) : [];
  } catch {
    return [];
  }
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
