import auditPlan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { IRiskAuditPlan } from '@actiontech/shared/lib/api/sqle/service/common';
import type { RiskAuditLevelSource } from '../../../components/AuditResultMessage/RiskAuditLevelCell';

export type RiskAuditPlanWithLevel = IRiskAuditPlan & RiskAuditLevelSource;

type AuditResultLike = {
  level?: string;
  error_priority?: string;
};

/** 从 V1 报告串前缀解析三态（V2 偶发丢 error_priority 时的只读回填） */
const parsePriorityFromAuditResultText = (
  text?: string
): AuditResultLike | null => {
  const raw = String(text || '');
  if (!raw) {
    return null;
  }
  if (/错误\s*[-–]?\s*P0|错误\s*[（(]P0[）)]|error\s*[-–]?\s*P0/i.test(raw)) {
    return { level: 'error', error_priority: 'P0' };
  }
  if (/错误\s*[-–]?\s*P1|错误\s*[（(]P1[）)]|error\s*[-–]?\s*P1/i.test(raw)) {
    return { level: 'error', error_priority: 'P1' };
  }
  if (/\[?\s*错误\s*\]?|\[?\s*error\s*\]?/i.test(raw)) {
    return { level: 'error' };
  }
  return null;
};

/**
 * 列表接口未带 priority 时，按报告 SQL 只读回填等级信息（S2 §8.10；不改评分统计）。
 * 优先读 V2 结构化 error_priority；若为空则解析 V1 文案前缀（如 [错误-P0]）。
 */
export const enrichRiskAuditPlansWithLevel = async (
  projectName: string,
  list: IRiskAuditPlan[] | undefined
): Promise<RiskAuditPlanWithLevel[]> => {
  const rows = list ?? [];
  if (!rows.length) {
    return [];
  }

  return Promise.all(
    rows.map(async (item) => {
      const named = item as RiskAuditPlanWithLevel;
      if (
        named.audit_result?.length ||
        named.error_priority ||
        named.audit_error_priority
      ) {
        return named;
      }
      if (!item.audit_plan_name || item.audit_plan_report_id == null) {
        return named;
      }

      const reportId = String(item.audit_plan_report_id);
      const audit_result: AuditResultLike[] = [];

      try {
        const resV2 = await auditPlan.getAuditPlanReportsSQLs({
          project_name: projectName,
          audit_plan_name: item.audit_plan_name,
          audit_plan_report_id: reportId,
          page_index: 1,
          page_size: 50
        });
        (resV2.data.data ?? []).forEach((sql) => {
          (sql.audit_plan_report_sql_audit_result ?? []).forEach((result) => {
            const withPriority = result as AuditResultLike;
            if (!withPriority.level) {
              return;
            }
            if (withPriority.error_priority) {
              audit_result.push({
                level: withPriority.level,
                error_priority: withPriority.error_priority
              });
            }
          });
        });
      } catch {
        // ignore，走 V1 回填
      }

      if (!audit_result.length) {
        try {
          const resV1 = await auditPlan.getAuditPlanReportsSQLsV1({
            project_name: projectName,
            audit_plan_name: item.audit_plan_name,
            audit_plan_report_id: reportId,
            page_index: 1,
            page_size: 50
          });
          (resV1.data.data ?? []).forEach((sql) => {
            const parsed = parsePriorityFromAuditResultText(
              sql.audit_plan_report_sql_audit_result
            );
            if (parsed) {
              audit_result.push(parsed);
            }
          });
        } catch {
          return named;
        }
      }

      return audit_result.length ? { ...named, audit_result } : named;
    })
  );
};
