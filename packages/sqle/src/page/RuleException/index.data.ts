import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IBlacklistResV1Extended, RuleScopeMode } from './index.type';
import { normalizeMatchConditionsForRead, parseRuleScopeMode } from './utils';

export const RULE_EXCEPTION_DETAIL_QUERY_KEY = 'blacklist_id';

/** API response alias for scan task type in match_conditions */
export const MATCH_CONDITION_READ_TYPE_SOURCE = 'source' as const;

/** API response alias for scan task instance ID in match_conditions */
export const MATCH_CONDITION_READ_TYPE_SOURCE_ID = 'source_id' as const;

export type MatchConditionReadTypeAlias =
  | typeof MATCH_CONDITION_READ_TYPE_SOURCE
  | typeof MATCH_CONDITION_READ_TYPE_SOURCE_ID;

/** Write API uses audit_task_*; read responses may use source / source_id */
export const MATCH_CONDITION_TYPE_WRITE_TO_READ: Record<
  | MatchConditionReqV1TypeEnum.audit_task_type
  | MatchConditionReqV1TypeEnum.audit_task_id,
  MatchConditionReadTypeAlias
> = {
  [MatchConditionReqV1TypeEnum.audit_task_type]:
    MATCH_CONDITION_READ_TYPE_SOURCE,
  [MatchConditionReqV1TypeEnum.audit_task_id]:
    MATCH_CONDITION_READ_TYPE_SOURCE_ID
};

export const MATCH_CONDITION_TYPE_READ_TO_WRITE: Record<
  MatchConditionReadTypeAlias,
  | MatchConditionReqV1TypeEnum.audit_task_type
  | MatchConditionReqV1TypeEnum.audit_task_id
> = {
  [MATCH_CONDITION_READ_TYPE_SOURCE]:
    MatchConditionReqV1TypeEnum.audit_task_type,
  [MATCH_CONDITION_READ_TYPE_SOURCE_ID]:
    MatchConditionReqV1TypeEnum.audit_task_id
};

export const RULE_SCOPE_ALL_VALUE = 'ALL' as const;

export type RuleScopeWriteValue = typeof RULE_SCOPE_ALL_VALUE | string[];

const READ_AUDIT_TASK_TYPE_ALIASES = [
  MatchConditionReqV1TypeEnum.audit_task_type,
  MATCH_CONDITION_READ_TYPE_SOURCE
] as const;

const READ_AUDIT_TASK_ID_ALIASES = [
  MatchConditionReqV1TypeEnum.audit_task_id,
  MATCH_CONDITION_READ_TYPE_SOURCE_ID
] as const;

export const normalizeRuleScopeMode = (
  ruleScope?: RuleScopeWriteValue | null,
  ruleScopeMode?: RuleScopeMode
): RuleScopeMode => {
  if (ruleScopeMode) {
    return ruleScopeMode;
  }
  return parseRuleScopeMode(ruleScope);
};

export { normalizeRuleScopeList } from './utils';

export const blacklistRecordToExtended = (
  record: IBlacklistResV1
): IBlacklistResV1Extended => {
  const ruleScope = record.rule_scope as RuleScopeWriteValue | undefined;
  return {
    ...record,
    rule_scope: ruleScope,
    rule_scope_mode: normalizeRuleScopeMode(ruleScope, record.rule_scope_mode),
    match_conditions: normalizeMatchConditionsForRead(record.match_conditions)
  };
};

export const BASE_MATCH_TYPE_VALUES = [
  CreateBlacklistReqV1TypeEnum.sql,
  CreateBlacklistReqV1TypeEnum.fp_sql,
  CreateBlacklistReqV1TypeEnum.ip,
  CreateBlacklistReqV1TypeEnum.cidr,
  CreateBlacklistReqV1TypeEnum.host,
  CreateBlacklistReqV1TypeEnum.instance,
  CreateBlacklistReqV1TypeEnum.db_user
] as const;

export const EXTENDED_MATCH_CONDITION_TYPES = [
  MatchConditionReqV1TypeEnum.instance,
  MatchConditionReqV1TypeEnum.audit_task_type,
  MatchConditionReqV1TypeEnum.audit_task_id,
  MatchConditionReqV1TypeEnum.db_type,
  MatchConditionReqV1TypeEnum.fp_sql,
  MatchConditionReqV1TypeEnum.sql,
  MatchConditionReqV1TypeEnum.ip,
  MatchConditionReqV1TypeEnum.cidr,
  MatchConditionReqV1TypeEnum.host,
  MatchConditionReqV1TypeEnum.db_user
] as const;

export const isAuditTaskMatchConditionType = (type?: string) => {
  if (!type) {
    return false;
  }
  return (
    READ_AUDIT_TASK_TYPE_ALIASES.includes(
      type as (typeof READ_AUDIT_TASK_TYPE_ALIASES)[number]
    ) ||
    READ_AUDIT_TASK_ID_ALIASES.includes(
      type as (typeof READ_AUDIT_TASK_ID_ALIASES)[number]
    )
  );
};

export const isBaseMatchAuditTaskType = (type?: string) => {
  return (
    type === MatchConditionReqV1TypeEnum.audit_task_type ||
    type === MatchConditionReqV1TypeEnum.audit_task_id
  );
};

export {
  buildBlacklistPrefillFromSqlManage,
  buildRuleExceptionFromSqlManage,
  buildSqlManageRuleExceptionContext,
  blacklistToRows,
  formatMatchMode,
  formatMatchModeDisplayText,
  formatMatchModeItems,
  formatRuleScope,
  normalizeMatchConditionsForRead,
  normalizeMatchConditionsForWrite,
  normalizeRuleScopeForWrite,
  parseRuleScopeMode,
  resolveDbTypeFromAuditResults,
  resolveDbTypeFromRuleTips,
  resolveQuickAddRuleExceptionDbType,
  resolveRuleExceptionDbType,
  buildQuickAddRuleExceptionSummaryItems,
  rowsToBlacklistBody,
  toSqlManageRuleExceptionRecord,
  validateMatchRows
} from './utils';

export type {
  BuildBlacklistPrefillFromSqlManageOptions,
  FormattedMatchModeItem,
  FormattedRuleScope,
  FormattedRuleScopeItem,
  ISqlManageRuleExceptionContext,
  MatchRow,
  QuickAddRuleExceptionSummaryItem,
  SqlManageRuleExceptionRecord
} from './utils';

/** @deprecated use normalizeRuleScopeForWrite */
export { normalizeRuleScopeForWrite as serializeRuleScopeForWrite } from './utils';
