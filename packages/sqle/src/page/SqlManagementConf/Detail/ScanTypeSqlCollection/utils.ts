import {
  IAuditResult,
  IAuditPlanSQLHeadV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditResultInfoItem } from '../../../../components/AuditResultMessage/index.type';

export const BEING_AUDITED = 'being_audited';
export const AUDITED = 'audited';

const AUDIT_STATUS_FIELD = 'audit_status';
const AUDIT_RESULTS_FIELD = 'audit_results';
const PRIORITY_FIELD = 'priority';

type AuditResultJsonItem = IAuditResult & {
  execution_failed?: boolean;
};

export const parseAuditResult = (
  resultString: string
): AuditResultInfoItem[] => {
  let results: AuditResultJsonItem[] = [];
  try {
    const parsed = JSON.parse(resultString ?? '[]') as
      | AuditResultJsonItem[]
      | null;
    results = Array.isArray(parsed) ? parsed : [];
  } catch {
    results = [];
  }
  return results.map((item) => ({
    level: item.level ?? '',
    executionFailed: !!item.execution_failed
  }));
};

export type AuditColumnLabels = {
  auditStatus: string;
  auditResult: string;
};

/**
 * 在后端返回的 head 中注入 `audit_status` 列，并按以下顺序排列：
 *   ... → audit_status → priority → audit_results → ...
 * 即：保证 `audit_status` 出现在 `priority` 之前；若 `priority` 不存在，则
 * 退化为出现在 `audit_results` 之前。
 *
 * 同时统一覆盖 `audit_results` 列标题为「审核结果」，避免后端返回的旧文案。
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
      if (item.field_name === AUDIT_RESULTS_FIELD) {
        return { ...item, desc: labels.auditResult };
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
  const insertIndex =
    priorityIndex !== -1
      ? priorityIndex
      : withoutAuditStatus.findIndex(
          (item) => item.field_name === AUDIT_RESULTS_FIELD
        );

  if (insertIndex === -1) {
    return withoutAuditStatus;
  }

  return [
    ...withoutAuditStatus.slice(0, insertIndex),
    auditStatusColumn,
    ...withoutAuditStatus.slice(insertIndex)
  ];
};
