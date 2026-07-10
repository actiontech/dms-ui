import {
  IAuditResult,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';

export const PASS_AUDIT_LEVELS = ['normal', 'UNKNOWN'] as const;

export const isPassAuditLevel = (level?: string) =>
  !level ||
  PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number]);

export const AUDIT_LEVEL_DISPLAY_ORDER = ['error', 'warn', 'notice'] as const;

export type AuditLevelSummaryKey = (typeof AUDIT_LEVEL_DISPLAY_ORDER)[number];

export const getAuditResultLevel = (
  auditResult: IAuditResult & { audit_level?: string }
) => auditResult.level ?? auditResult.audit_level ?? '';

type ResolveSkippedRuleExceptionDisplayLevelOptions = {
  ruleTemplateLevel?: string;
};

/** Display level for skipped-by-exception rules (never from audit_result). */
export const resolveSkippedRuleExceptionDisplayLevel = (
  item: ISkippedByRuleExceptionItem,
  options?: ResolveSkippedRuleExceptionDisplayLevelOptions
) => {
  const level = item.level ?? '';

  if (!isPassAuditLevel(level)) {
    return level;
  }

  const { ruleTemplateLevel } = options ?? {};
  if (ruleTemplateLevel && !isPassAuditLevel(ruleTemplateLevel)) {
    return ruleTemplateLevel;
  }

  return level;
};

export const countAuditResultsByLevel = (
  auditResults?: IAuditResult[]
): Partial<Record<AuditLevelSummaryKey, number>> => {
  const counts: Partial<Record<AuditLevelSummaryKey, number>> = {};

  if (!Array.isArray(auditResults)) {
    return counts;
  }

  auditResults.forEach((auditResult) => {
    const level = getAuditResultLevel(auditResult);

    if (
      !level ||
      PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number])
    ) {
      return;
    }

    if (!AUDIT_LEVEL_DISPLAY_ORDER.includes(level as AuditLevelSummaryKey)) {
      return;
    }

    const summaryLevel = level as AuditLevelSummaryKey;
    counts[summaryLevel] = (counts[summaryLevel] ?? 0) + 1;
  });

  return counts;
};

export const hasAuditViolations = (auditResults?: IAuditResult[]) =>
  Object.keys(countAuditResultsByLevel(auditResults)).length > 0;
