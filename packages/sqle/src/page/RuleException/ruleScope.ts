import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { RULE_SCOPE_ALL_VALUE, type RuleScopeWriteValue } from './constants';
import { RuleScopeMode } from './index.type';
import {
  normalizeMatchConditionsForRead,
  normalizeMatchConditionTypeForRead
} from './matchCondition';

export const parseRuleScopeMode = (
  ruleScope?: RuleScopeWriteValue | null
): RuleScopeMode => {
  if (
    !ruleScope ||
    ruleScope === RULE_SCOPE_ALL_VALUE ||
    (Array.isArray(ruleScope) && ruleScope.length === 0)
  ) {
    return AuditWhitelistResV1RuleScopeModeEnum.all;
  }
  return AuditWhitelistResV1RuleScopeModeEnum.specific;
};

export const normalizeRuleScopeList = (
  ruleScope?: RuleScopeWriteValue | null
): string[] => {
  if (!ruleScope || ruleScope === RULE_SCOPE_ALL_VALUE) {
    return [];
  }
  return ruleScope;
};

export const normalizeRuleScopeForWrite = (
  mode: RuleScopeMode,
  specificRules?: string[]
): RuleScopeWriteValue | undefined => {
  if (mode === AuditWhitelistResV1RuleScopeModeEnum.all) {
    return RULE_SCOPE_ALL_VALUE;
  }
  return specificRules ?? [];
};

export const encodeRuleNameForPath = (ruleName: string) =>
  encodeURIComponent(ruleName);

export type FormattedRuleScopeItem = {
  ruleName?: string;
  label: string;
  navigatePath?: string;
  level?: string;
  dbType?: string;
  annotation?: string;
};

export type FormattedRuleScope = {
  mode: RuleScopeMode;
  ruleNames: string[];
  ruleLabels: string[];
  rules: FormattedRuleScopeItem[];
};

export const buildRuleKnowledgePath = (
  ruleName?: string,
  dbType?: string
): string | undefined => {
  const normalizedRuleName = ruleName?.trim();
  const normalizedDbType = dbType?.trim();
  if (!normalizedRuleName || !normalizedDbType) {
    return undefined;
  }
  return `/sqle/rule/knowledge/${encodeRuleNameForPath(
    normalizedRuleName
  )}/${encodeURIComponent(normalizedDbType)}`;
};

const resolveBlacklistDbType = (
  item: IAuditWhitelistResV1
): string | undefined => {
  for (const row of item.match_conditions_display ?? []) {
    if (
      normalizeMatchConditionTypeForRead(row.type) ===
      MatchConditionReqV1TypeEnum.db_type
    ) {
      return row.content?.trim();
    }
  }
  for (const row of normalizeMatchConditionsForRead(item.match_conditions)) {
    if (row.type === MatchConditionReqV1TypeEnum.db_type) {
      return row.content?.trim();
    }
  }
  return undefined;
};

export const formatRuleScope = (
  item: IAuditWhitelistResV1
): FormattedRuleScope => {
  const ruleScope = item.rule_scope as RuleScopeWriteValue | undefined;
  const mode = item.rule_scope_mode ?? parseRuleScopeMode(ruleScope);
  const ruleNames = normalizeRuleScopeList(ruleScope);
  const isAll =
    mode === AuditWhitelistResV1RuleScopeModeEnum.all || ruleNames.length === 0;

  const fallbackDbType = resolveBlacklistDbType(item);
  const rules: FormattedRuleScopeItem[] = (item.rule_scope_display ?? []).map(
    (rule) => {
      const dbType = rule.db_type ?? fallbackDbType;
      return {
        ruleName: rule.rule_name,
        label: rule.rule_desc ?? '-',
        navigatePath: buildRuleKnowledgePath(rule.rule_name, dbType),
        level: rule.level,
        dbType,
        annotation: (rule as { annotation?: string }).annotation
      };
    }
  );

  return {
    mode: isAll ? AuditWhitelistResV1RuleScopeModeEnum.all : mode,
    ruleNames,
    ruleLabels: rules.map((rule) => rule.label),
    rules
  };
};
