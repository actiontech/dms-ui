import {
  IAuditResult,
  IAuditTaskSQLResV2,
  IAuditWhitelistResV1,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAuditWhitelistV1FilterSqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';
import { IAuditWhitelistResV1Extended, RuleScopeMode } from './index.type';
import {
  MATCH_CONDITION_READ_TYPE_SOURCE,
  MATCH_CONDITION_READ_TYPE_SOURCE_ID,
  type RuleScopeWriteValue
} from './constants';
import {
  normalizeMatchConditionsForRead,
  parseRuleScopeMode,
  resolveDbTypeFromAuditResults
} from './utils';
import type {
  SqlAuditRuleExceptionSourceContext,
  SqlManageRuleExceptionRecord
} from './utils';

export {
  MATCH_CONDITION_READ_TYPE_SOURCE,
  MATCH_CONDITION_READ_TYPE_SOURCE_ID,
  RULE_SCOPE_ALL_VALUE
} from './constants';
export type { RuleScopeWriteValue } from './constants';

export type AuditResultDisplayBuckets = {
  active: IAuditResult[];
  exempted: ISkippedByRuleExceptionItem[];
};

/** Mutually exclusive buckets: active hits vs skipped-by-exception rules. */
export const buildAuditResultDisplayBuckets = (
  auditResult: IAuditResult[] = [],
  skippedByRuleException: ISkippedByRuleExceptionItem[] = []
): AuditResultDisplayBuckets => ({
  active: auditResult,
  exempted: skippedByRuleException
});

type FullSqlExemptionInput = {
  audit_result?: IAuditResult[];
  skipped_by_rule_exception?: ISkippedByRuleExceptionItem[];
};

/** No active hits and at least one skipped rule exception. */
export const isFullSqlExemption = (sql: FullSqlExemptionInput) =>
  (sql.audit_result?.length ?? 0) === 0 &&
  (sql.skipped_by_rule_exception?.length ?? 0) > 0;

/**
 * 整句「审核SQL例外」标记项：无 rule_name 且等级为通过（normal / 空）。
 * FullSqlExemptedResultItem 会固定用绿勾展示。
 *
 * 注意：智能扫描会把真实命中（如「表已存在」、level=error、rule_name=""）
 * 也放进例外列表；这类项必须按原等级渲染，不能走整句例外标记。
 */
export const isFullSqlExemptionMarkerItem = (
  item: Pick<ISkippedByRuleExceptionItem, 'rule_name' | 'level'>
) => {
  if (item.rule_name?.trim()) {
    return false;
  }
  const level = item.level ?? '';
  return !level || level === 'normal' || level === 'UNKNOWN';
};

/**
 * Whether an exempted list item should use the full-SQL exemption UI
 * (vs a normal exempted rule row). Shared by Report panel and AuditResultTree.
 */
export const shouldRenderAsFullSqlExemptedItem = (
  fullSqlExemption: boolean,
  item: Pick<ISkippedByRuleExceptionItem, 'rule_name' | 'level'>
) => fullSqlExemption && isFullSqlExemptionMarkerItem(item);

export const resolvePrimaryExceptionId = (
  skippedByRuleException?: ISkippedByRuleExceptionItem[]
): number | undefined =>
  skippedByRuleException?.find((item) => item.exception_id != null)
    ?.exception_id;

export const RULE_EXCEPTION_DETAIL_QUERY_KEY = 'blacklist_id';

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

export const enrichSqlManageRuleExceptionRecord = (
  record?: SqlManageRuleExceptionRecord | null,
  instanceTips?: Array<{
    instance_id?: string;
    instance_name?: string;
    instance_type?: string;
  }>
): SqlManageRuleExceptionRecord | null | undefined => {
  if (!record) {
    return record;
  }

  const instanceName = record.instance_name?.trim();
  const matchedInstance = instanceName
    ? instanceTips?.find((tip) => tip.instance_name === instanceName)
    : undefined;

  const instanceId = record.instance_id?.trim() || matchedInstance?.instance_id;
  const dbType =
    record.db_type?.trim() ||
    record.audit_plan_db_type?.trim() ||
    matchedInstance?.instance_type?.trim() ||
    resolveDbTypeFromAuditResults(record.audit_result);

  if (
    instanceId === record.instance_id &&
    dbType === record.db_type &&
    !record.audit_plan_db_type
  ) {
    return record;
  }

  return {
    ...record,
    instance_id: instanceId,
    db_type: dbType
  };
};

export const toSqlAuditRuleExceptionRecord = (
  auditSql?: IAuditTaskSQLResV2 | null,
  sourceContext?: SqlAuditRuleExceptionSourceContext
): SqlManageRuleExceptionRecord | undefined => {
  if (!auditSql) {
    return undefined;
  }

  const sql = auditSql.exec_sql?.trim();
  if (!sql) {
    return undefined;
  }

  const sqlAuditRecordId = sourceContext?.sqlAuditRecordId?.trim();
  const task = sourceContext?.task;

  return {
    sql_fingerprint: sql,
    sql,
    instance_name: task?.instance_name,
    db_type: task?.instance_db_type,
    source: sqlAuditRecordId
      ? {
          sql_source_type:
            getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record,
          sql_source_ids: [sqlAuditRecordId]
        }
      : undefined,
    audit_result: auditSql.audit_result
  };
};

export const auditWhitelistRecordToExtended = (
  record: IAuditWhitelistResV1
): IAuditWhitelistResV1Extended => {
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
  MatchConditionReqV1TypeEnum.sql_source,
  MatchConditionReqV1TypeEnum.fp_sql,
  MatchConditionReqV1TypeEnum.sql
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
  buildAuditWhitelistPrefillFromSqlManage,
  buildBlacklistPrefillFromSqlManage,
  buildSqlManageRuleExceptionContext,
  auditWhitelistToRows,
  formatMatchMode,
  formatMatchModeItems,
  formatRuleScope,
  normalizeMatchConditionsForRead,
  normalizeMatchConditionsForWrite,
  normalizeRuleScopeForWrite,
  parseRuleScopeMode,
  resolveDbTypeFromAuditResults,
  resolveDbTypeFromRuleTips,
  resolveRuleExceptionDbType,
  rowsToBlacklistBody,
  rowsToAuditWhitelistBody,
  toScanTaskRuleExceptionRecord,
  toSqlManageRuleExceptionRecord,
  validateMatchRows,
  validateAuditWhitelistMatchRows
} from './utils';

export type {
  BuildBlacklistPrefillFromSqlManageOptions,
  FormattedMatchModeItem,
  FormattedRuleScope,
  FormattedRuleScopeItem,
  ISqlManageRuleExceptionContext,
  MatchRow,
  ScanTaskRuleExceptionRecordInput,
  ScanTaskRuleExceptionSourceContext,
  SqlAuditRuleExceptionSourceContext,
  SqlManageRuleExceptionRecord
} from './utils';

/** @deprecated use normalizeRuleScopeForWrite */
export { normalizeRuleScopeForWrite as serializeRuleScopeForWrite } from './utils';
