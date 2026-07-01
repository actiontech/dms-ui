import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import {
  IBlacklistResV1,
  IAuditResult,
  IMatchConditionDisplayV1,
  IMatchConditionReqV1,
  IRuleTips,
  ISource
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  BlacklistResV1RuleScopeModeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { RuleScopeMode } from './index.type';

const BLACKLIST_ID_PATTERN = /blacklist_id=(\d+)/;
const GENERIC_ID_PATTERN = /id=(\d+)/;

const MATCH_CONDITION_READ_TYPE_SOURCE = 'source';
const MATCH_CONDITION_READ_TYPE_SOURCE_ID = 'source_id';
const RULE_SCOPE_ALL_VALUE = 'ALL';

type RuleScopeWriteValue = typeof RULE_SCOPE_ALL_VALUE | string[];

export const parseConflictBlacklistId = (message?: string): number | null => {
  if (!message) {
    return null;
  }
  const blacklistMatch = message.match(BLACKLIST_ID_PATTERN);
  if (blacklistMatch?.[1]) {
    return Number(blacklistMatch[1]);
  }
  const genericMatch = message.match(GENERIC_ID_PATTERN);
  if (genericMatch?.[1]) {
    return Number(genericMatch[1]);
  }
  return null;
};

/** @deprecated use parseConflictBlacklistId */
export const parseRuleExceptionConflictId = parseConflictBlacklistId;

export const encodeRuleNameForPath = (ruleName: string) =>
  encodeURIComponent(ruleName);

const normalizeMatchConditionTypeForRead = (
  type?: string
): MatchConditionReqV1TypeEnum | string | undefined => {
  if (!type) {
    return type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE) {
    return MatchConditionReqV1TypeEnum.audit_task_type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE_ID) {
    return MatchConditionReqV1TypeEnum.audit_task_id;
  }
  return type;
};

const normalizeMatchConditionTypeForWrite = (
  type: MatchConditionReqV1TypeEnum | string
): MatchConditionReqV1TypeEnum | string => {
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE) {
    return MatchConditionReqV1TypeEnum.audit_task_type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE_ID) {
    return MatchConditionReqV1TypeEnum.audit_task_id;
  }
  return type;
};

export const normalizeMatchConditionsForRead = (
  matchConditions?: IMatchConditionReqV1[] | null
): IMatchConditionReqV1[] => {
  return (matchConditions ?? []).map((item) => ({
    ...item,
    type: normalizeMatchConditionTypeForRead(
      item.type
    ) as MatchConditionReqV1TypeEnum
  }));
};

export const normalizeMatchConditionsForWrite = (
  matchConditions?: IMatchConditionReqV1[] | null
): IMatchConditionReqV1[] | undefined => {
  if (!matchConditions?.length) {
    return undefined;
  }
  return matchConditions.map((item) => ({
    content: item.content,
    type: normalizeMatchConditionTypeForWrite(
      item.type ?? ''
    ) as MatchConditionReqV1TypeEnum
  }));
};

export const parseRuleScopeMode = (
  ruleScope?: RuleScopeWriteValue | null
): RuleScopeMode => {
  if (
    !ruleScope ||
    ruleScope === RULE_SCOPE_ALL_VALUE ||
    (Array.isArray(ruleScope) && ruleScope.length === 0)
  ) {
    return BlacklistResV1RuleScopeModeEnum.all;
  }
  return BlacklistResV1RuleScopeModeEnum.specific;
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
  if (mode === BlacklistResV1RuleScopeModeEnum.all) {
    return RULE_SCOPE_ALL_VALUE;
  }
  return specificRules ?? [];
};

export const buildRuleExceptionDetailPath = (
  projectID: string,
  blacklistId: number | string,
  queryKey = 'blacklist_id'
) =>
  `/sqle/project/${projectID}/sql-management-exception?${queryKey}=${blacklistId}`;

export const PROJECT_RULE_EXCEPTION_ROUTE = `${PROJECT_ROUTER_PARAM}/sql-management-exception`;

export type ISqlManageRuleExceptionContext = {
  sql_fingerprint: string;
  instance_id?: string;
  db_type?: string;
  source?: Pick<
    ISource,
    'sql_source_type' | 'sql_source_ids' | 'sql_source_desc'
  >;
};

export const resolveDbTypeFromAuditResults = (
  auditResults?: Array<{ db_type?: string }> | null
): string | undefined => {
  return auditResults?.find((item) => item.db_type?.trim())?.db_type?.trim();
};

export const resolveRuleExceptionDbType = (
  sqlManageContext?: ISqlManageRuleExceptionContext,
  auditResult?: Pick<IAuditResult, 'db_type'>,
  auditResults?: Array<{ db_type?: string }> | null,
  fallbackDbType?: string
): string | undefined => {
  return (
    auditResult?.db_type?.trim() ||
    sqlManageContext?.db_type?.trim() ||
    resolveDbTypeFromAuditResults(auditResults) ||
    fallbackDbType?.trim()
  );
};

export const resolveDbTypeFromRuleTips = (
  ruleName?: string,
  ruleTips?: IRuleTips[] | null
): string | undefined => {
  if (!ruleName?.trim() || !ruleTips?.length) {
    return undefined;
  }
  for (const group of ruleTips) {
    const matched = group.rule?.some((rule) => rule.rule_name === ruleName);
    if (matched && group.db_type?.trim()) {
      return group.db_type.trim();
    }
  }
  return undefined;
};

export const resolveQuickAddRuleExceptionDbType = (
  sqlManageContext?: ISqlManageRuleExceptionContext,
  auditResult?: Pick<IAuditResult, 'db_type'>,
  auditResults?: Array<{ db_type?: string }> | null,
  ruleName?: string,
  ruleTips?: IRuleTips[] | null,
  fallbackDbType?: string
): string | undefined => {
  return (
    resolveRuleExceptionDbType(
      sqlManageContext,
      auditResult,
      auditResults,
      fallbackDbType
    ) || resolveDbTypeFromRuleTips(ruleName, ruleTips)
  );
};

export type QuickAddRuleExceptionSummaryItem = {
  key: string;
  label: string;
  value?: string;
};

export const buildQuickAddRuleExceptionSummaryItems = (options: {
  sqlManageContext?: ISqlManageRuleExceptionContext;
  ruleName?: string;
  ruleLabel?: string;
  getLabel: (key: string) => string;
}): QuickAddRuleExceptionSummaryItem[] => {
  const { sqlManageContext, ruleName, ruleLabel, getLabel } = options;
  const source = sqlManageContext?.source;
  const auditTaskName =
    source?.sql_source_desc?.trim() ||
    source?.sql_source_ids?.[0]?.trim() ||
    undefined;

  return [
    {
      key: 'audit_task_type',
      label: getLabel('audit_task_type'),
      value: source?.sql_source_type?.trim()
    },
    {
      key: 'audit_task_name',
      label: getLabel('audit_task_name'),
      value: auditTaskName
    },
    {
      key: 'fingerPrint',
      label: getLabel('fingerPrint'),
      value: sqlManageContext?.sql_fingerprint?.trim()
    },
    {
      key: 'rule_scope',
      label: getLabel('rule_scope'),
      value: ruleLabel?.trim() || ruleName?.trim()
    }
  ];
};

export type MatchRow = {
  type: CreateBlacklistReqV1TypeEnum | MatchConditionReqV1TypeEnum;
  content: string;
};

export type FormattedMatchModeItem = {
  type?: string;
  typeLabel: string;
  content?: string;
  navigatePath?: string;
};

const isAuditTaskIdDisplayType = (type?: string): boolean => {
  return (
    normalizeMatchConditionTypeForRead(type) ===
    MatchConditionReqV1TypeEnum.audit_task_id
  );
};

const isAuditTaskTypeDisplayType = (type?: string): boolean => {
  return (
    normalizeMatchConditionTypeForRead(type) ===
    MatchConditionReqV1TypeEnum.audit_task_type
  );
};

export type FormatMatchModeOptions = {
  resolveAuditTaskTypeLabel?: (content: string) => string | undefined;
};

const resolveMatchModeContent = (
  type: string | undefined,
  content: string | undefined,
  contentDisplay: string | undefined,
  resolveAuditTaskTypeLabel?: (content: string) => string | undefined
): string | undefined => {
  const rawContent = content?.trim();
  const display = contentDisplay?.trim();

  if (isAuditTaskTypeDisplayType(type) && rawContent) {
    if (display && display !== rawContent) {
      return display;
    }
    return resolveAuditTaskTypeLabel?.(rawContent) ?? display ?? rawContent;
  }

  return display ?? rawContent;
};

const buildMatchConditionsDisplayRows = (
  item: IBlacklistResV1
): IMatchConditionDisplayV1[] => {
  if (item.match_conditions_display?.length) {
    return item.match_conditions_display;
  }
  return normalizeMatchConditionsForRead(item.match_conditions).map(
    (condition) => ({
      type: condition.type,
      content: condition.content
    })
  );
};

export type FormattedRuleScope = {
  mode: RuleScopeMode;
  ruleNames: string[];
  ruleLabels: string[];
};

export const formatMatchModeItems = (
  item: IBlacklistResV1
): Array<{ type?: string; content?: string }> => {
  const rows: Array<{ type?: string; content?: string }> = [];
  if (item.type) {
    rows.push({ type: item.type, content: item.content });
  }
  normalizeMatchConditionsForRead(item.match_conditions).forEach(
    (condition) => {
      rows.push({ type: condition.type, content: condition.content });
    }
  );
  return rows;
};

export const formatMatchMode = (
  item: IBlacklistResV1,
  getTypeLabel: (type?: string) => string,
  options?: FormatMatchModeOptions
): FormattedMatchModeItem[] => {
  const { resolveAuditTaskTypeLabel } = options ?? {};
  const rows: FormattedMatchModeItem[] = [];

  if (item.type) {
    rows.push({
      type: item.type,
      typeLabel: getTypeLabel(item.type),
      content: item.content
    });
  }

  buildMatchConditionsDisplayRows(item).forEach((row) => {
    const normalizedType = normalizeMatchConditionTypeForRead(row.type);
    rows.push({
      type: normalizedType,
      typeLabel: getTypeLabel(normalizedType),
      content: resolveMatchModeContent(
        normalizedType,
        row.content,
        row.content_display,
        resolveAuditTaskTypeLabel
      ),
      navigatePath: isAuditTaskIdDisplayType(normalizedType)
        ? row.navigate_path
        : undefined
    });
  });

  return rows;
};

export const formatMatchModeDisplayText = (
  item: IBlacklistResV1,
  getTypeLabel: (type?: string) => string,
  options?: FormatMatchModeOptions
): string => {
  return formatMatchMode(item, getTypeLabel, options)
    .map((row) =>
      row.content !== undefined
        ? `${row.typeLabel}：${row.content ?? '-'}`
        : row.typeLabel
    )
    .join('；');
};

export const formatMatchModeTypeLabels = (
  item: IBlacklistResV1,
  getTypeLabel: (type?: string) => string
): string[] => {
  const seen = new Set<string>();
  const labels: string[] = [];
  const addType = (type?: string) => {
    if (!type || seen.has(type)) {
      return;
    }
    seen.add(type);
    labels.push(getTypeLabel(type));
  };

  addType(item.type);
  (item.match_conditions_display ?? []).forEach((row) => addType(row.type));

  return labels;
};

export const formatRuleScope = (item: IBlacklistResV1): FormattedRuleScope => {
  const ruleScope = item.rule_scope as RuleScopeWriteValue | undefined;
  const mode = item.rule_scope_mode ?? parseRuleScopeMode(ruleScope);
  const ruleNames = normalizeRuleScopeList(ruleScope);
  const isAll =
    mode === BlacklistResV1RuleScopeModeEnum.all || ruleNames.length === 0;

  return {
    mode: isAll ? BlacklistResV1RuleScopeModeEnum.all : mode,
    ruleNames,
    ruleLabels: (item.rule_scope_display ?? []).map(
      (rule) => rule.rule_desc ?? '-'
    )
  };
};

export const blacklistToRows = (item: IBlacklistResV1): MatchRow[] => {
  const rows: MatchRow[] = [];
  if (item.type) {
    rows.push({
      type: item.type as unknown as CreateBlacklistReqV1TypeEnum,
      content: item.content ?? ''
    });
  }
  normalizeMatchConditionsForRead(item.match_conditions).forEach(
    (condition) => {
      if (condition.type) {
        rows.push({
          type: condition.type,
          content: condition.content ?? ''
        });
      }
    }
  );
  if (!rows.length) {
    return [{ type: CreateBlacklistReqV1TypeEnum.sql, content: '' }];
  }
  return rows;
};

const appendDbTypeMatchCondition = (
  matchConditions: IMatchConditionReqV1[] | undefined,
  dbType?: string
): IMatchConditionReqV1[] | undefined => {
  if (!dbType?.trim()) {
    return matchConditions;
  }
  const conditions = [...(matchConditions ?? [])];
  const hasDbType = conditions.some(
    (item) => item.type === MatchConditionReqV1TypeEnum.db_type
  );
  if (!hasDbType) {
    conditions.push({
      type: MatchConditionReqV1TypeEnum.db_type,
      content: dbType.trim()
    });
  }
  return conditions.length ? conditions : undefined;
};

export const rowsToBlacklistBody = (
  rows: MatchRow[],
  scopeMode: RuleScopeMode,
  selectedRules?: string[],
  desc?: string,
  dbType?: string
) => {
  const [firstRow, ...restRows] = rows;
  let matchConditions = normalizeMatchConditionsForWrite(
    restRows.map((row) => ({
      type: row.type as MatchConditionReqV1TypeEnum,
      content: row.content
    }))
  );
  if (scopeMode === BlacklistResV1RuleScopeModeEnum.specific) {
    matchConditions = appendDbTypeMatchCondition(matchConditions, dbType);
  }
  return {
    type: firstRow.type as CreateBlacklistReqV1TypeEnum,
    content: firstRow.content,
    desc,
    match_conditions: matchConditions,
    rule_scope: normalizeRuleScopeForWrite(scopeMode, selectedRules)
  };
};

export const validateMatchRows = (rows?: MatchRow[]) => {
  if (!rows?.length) {
    return 'empty' as const;
  }
  const firstType = rows[0].type;
  if (
    firstType === MatchConditionReqV1TypeEnum.audit_task_type ||
    firstType === MatchConditionReqV1TypeEnum.audit_task_id ||
    firstType === MatchConditionReqV1TypeEnum.db_type
  ) {
    return 'invalidFirstType' as const;
  }
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.type || !row.content?.trim()) {
      return 'incomplete' as const;
    }
    const key = `${row.type}:${row.content.trim()}`;
    if (seen.has(key)) {
      return 'duplicate' as const;
    }
    seen.add(key);
  }
  return null;
};

export const buildRuleExceptionFromSqlManage = (
  record: ISqlManageRuleExceptionContext,
  ruleName: string,
  desc?: string,
  dbType?: string
) => {
  const match_conditions: IMatchConditionReqV1[] = [];
  const resolvedDbType = dbType ?? record.db_type;

  if (record.instance_id) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.instance,
      content: record.instance_id
    });
  }
  if (record.source?.sql_source_type) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.audit_task_type,
      content: record.source.sql_source_type
    });
  }
  if (record.source?.sql_source_ids?.[0]) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.audit_task_id,
      content: record.source.sql_source_ids[0]
    });
  }
  if (resolvedDbType) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.db_type,
      content: resolvedDbType
    });
  }

  return {
    type: CreateBlacklistReqV1TypeEnum.fp_sql,
    content: record.sql_fingerprint,
    match_conditions: match_conditions.length ? match_conditions : undefined,
    rule_scope: [ruleName],
    desc
  };
};
