import {
  IAuditResult,
  IRuleResV1,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import { IAuditResultItem } from '../ReportDrawer/index.type';
import { resolveSkippedRuleExceptionDisplayLevel } from './auditLevelUtils';
import { IAuditResultWithExtra } from './index.type';

export const findSkippedRuleExceptionMatch = (
  item: Pick<IAuditResult, 'rule_name'>,
  skippedByRuleException?: ISkippedByRuleExceptionItem[]
) =>
  skippedByRuleException?.find(
    (skipped) => !!item.rule_name && skipped.rule_name === item.rule_name
  );

export const resolveAuditResultMoreBtnLink = (
  item: Pick<IAuditResultItem, 'rule_name' | 'db_type'>,
  fallbackDbType?: string
) => {
  const dbType = item.db_type?.trim() || fallbackDbType?.trim();
  if (item.rule_name && dbType) {
    return `/sqle/rule/knowledge/${item.rule_name}/${dbType}`;
  }
  return '';
};

export const hasRuleKnowledgeExpandableContent = (
  item: Pick<IAuditResultItem, 'rule_name' | 'annotation'>
) => !!(item.rule_name?.trim() && item.annotation?.trim());

export const resolveAuditResultExpandProps = (
  item: Pick<IAuditResultItem, 'rule_name' | 'annotation' | 'db_type'>,
  fallbackDbType?: string,
  showAnnotationEnabled?: boolean
) => {
  if (!showAnnotationEnabled || !hasRuleKnowledgeExpandableContent(item)) {
    return {
      showAnnotation: false,
      moreBtnLink: ''
    };
  }

  return {
    showAnnotation: true,
    moreBtnLink: resolveAuditResultMoreBtnLink(item, fallbackDbType)
  };
};

const resolveIsRuleDeleted = (
  item: IAuditResultItem,
  findData: IRuleResV1 | Record<string, never>,
  options?: {
    loading?: boolean;
    ruleInfoFetched?: boolean;
  }
) => {
  const ruleName = item.rule_name?.trim();
  if (!ruleName || options?.loading || !options?.ruleInfoFetched) {
    return false;
  }

  return JSON.stringify(findData) === '{}';
};

type EnrichAuditResultItemOptions = {
  loading?: boolean;
  ruleInfoFetched?: boolean;
};

export const enrichAuditResultItemWithRuleInfo = (
  item: IAuditResultItem,
  ruleInfo?: IRuleResV1[],
  options?: EnrichAuditResultItemOptions
): IAuditResultItem => {
  const findData =
    ruleInfo?.find((rule) => rule.rule_name === item.rule_name) ?? {};
  const mergedItem = {
    ...findData,
    ...item,
    db_type: item.db_type ?? findData.db_type,
    desc: item.desc ?? findData.desc ?? '',
    annotation: item.annotation ?? findData.annotation ?? ''
  };

  return {
    ...mergedItem,
    level: mergedItem.level ?? '',
    isRuleDeleted: resolveIsRuleDeleted(item, findData, options)
  };
};

export type ExemptedAuditResultDisplayItem = ISkippedByRuleExceptionItem & {
  annotation?: string;
  db_type?: string;
  isRuleDeleted?: boolean;
  /** Rule template description; distinct from exception reason (`desc`). */
  ruleTemplateDesc?: string;
};

export const enrichSkippedRuleExceptionItem = (
  item: ISkippedByRuleExceptionItem,
  ruleInfo?: IRuleResV1[],
  options?: EnrichAuditResultItemOptions & { fallbackDbType?: string }
): ExemptedAuditResultDisplayItem => {
  const findData =
    ruleInfo?.find((rule) => rule.rule_name === item.rule_name) ?? {};
  const ruleTemplateLevel =
    'level' in findData ? (findData as IRuleResV1).level : undefined;

  return {
    ...item,
    level: resolveSkippedRuleExceptionDisplayLevel(item, {
      ruleTemplateLevel
    }),
    annotation:
      'annotation' in findData ? (findData as IRuleResV1).annotation ?? '' : '',
    ruleTemplateDesc:
      'desc' in findData ? (findData as IRuleResV1).desc ?? '' : '',
    db_type:
      ('db_type' in findData ? (findData as IRuleResV1).db_type : undefined) ??
      options?.fallbackDbType,
    isRuleDeleted: resolveIsRuleDeleted(
      { rule_name: item.rule_name } as IAuditResultItem,
      findData,
      options
    )
  };
};

export const buildAuditResultDisplayPayload = (
  item: IAuditResultItem
): IAuditResultWithExtra => ({
  level: item.level ?? '',
  message: item.message ?? '',
  rule_name: item.rule_name ?? '',
  desc: item.desc ?? '',
  annotation: item.annotation ?? '',
  i18n_audit_result_info: item.i18n_audit_result_info,
  db_type: item.db_type
});

export const buildSkippedRuleExceptionDisplayPayload = (
  item: ExemptedAuditResultDisplayItem
): IAuditResultWithExtra & { exception_id?: number } => ({
  level: item.level ?? '',
  message: item.message ?? '',
  rule_name: item.rule_name ?? '',
  // Exception `desc` is the reason comment (e.g. "SQL工单"), not the rule name.
  // Prefer rule template desc when enriched; otherwise fall back to `message`.
  desc: item.ruleTemplateDesc ?? '',
  annotation: item.annotation ?? '',
  db_type: item.db_type,
  exception_id: item.exception_id
});

export const collectAuditResultRuleNames = (
  auditResult?: IAuditResult[],
  skippedByRuleException?: ISkippedByRuleExceptionItem[]
) => {
  const names = new Set<string>();
  auditResult?.forEach((item) => {
    const ruleName = item.rule_name?.trim();
    if (ruleName) {
      names.add(ruleName);
    }
  });
  skippedByRuleException?.forEach((item) => {
    const ruleName = item.rule_name?.trim();
    if (ruleName) {
      names.add(ruleName);
    }
  });
  return [...names];
};

export const mergeAuditResultsForRuleLookup = (
  ...auditResultLists: Array<IAuditResult[] | undefined>
) => {
  const merged: IAuditResult[] = [];

  auditResultLists.forEach((list) => {
    list?.forEach((item) => {
      merged.push(item);
    });
  });

  return merged;
};
