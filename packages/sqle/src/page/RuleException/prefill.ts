import {
  IAuditTaskResV1,
  IAuditWhitelistResV1,
  IAuditResult,
  IMatchConditionReqV1,
  IRuleTips,
  ISource,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum,
  WorkflowStepResV2TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAuditWhitelistV1FilterSqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';
import {
  getAuditResultLevel,
  PASS_AUDIT_LEVELS
} from '../../components/AuditResultMessage/auditLevelUtils';
import { t } from '../../locale';

export type ISqlManageRuleExceptionContext = {
  sql_fingerprint: string;
  instance_id?: string;
  instance_name?: string;
  db_type?: string;
  source?: Pick<
    ISource,
    'sql_source_type' | 'sql_source_ids' | 'sql_source_desc'
  >;
};

export type SqlManageRuleExceptionRecord = {
  sql_fingerprint?: string;
  sql?: string;
  instance_id?: string;
  instance_name?: string;
  audit_plan_db_type?: string;
  db_type?: string;
  /** SQL管控行 schema_name；仅 preferSchemaObjectMatch 入口消费 */
  schema_name?: string;
  /** SQL管控行 info.schema_meta_name（表/视图）；仅 preferSchemaObjectMatch 入口消费 */
  schema_meta_name?: string;
  source?: ISqlManageRuleExceptionContext['source'];
  audit_result?: IAuditResult[] | null;
};

type ISqlManageWithInstanceId = ISqlManage & {
  instance_id?: string;
  db_type?: string;
  audit_plan_db_type?: string;
  /** AC-011 list透出；三种缺省（缺键/空串/省略 info）均视为无对象名 */
  info?: { schema_meta_name?: string } | null;
};

export const resolveSchemaMetaNameFromSqlManageInfo = (
  info?: { schema_meta_name?: string } | null
): string | undefined => {
  if (!info || typeof info !== 'object') {
    return undefined;
  }
  if (!Object.prototype.hasOwnProperty.call(info, 'schema_meta_name')) {
    return undefined;
  }
  const raw = info.schema_meta_name;
  if (typeof raw !== 'string') {
    return undefined;
  }
  const trimmed = raw.trim();
  return trimmed || undefined;
};

export const toSqlManageRuleExceptionRecord = (
  record?: ISqlManage
): SqlManageRuleExceptionRecord | undefined => {
  if (!record) {
    return undefined;
  }
  const recordWithExtra = record as ISqlManageWithInstanceId;
  return {
    sql_fingerprint: record.sql_fingerprint,
    sql: record.sql,
    instance_id: recordWithExtra.instance_id,
    instance_name: record.instance_name,
    audit_plan_db_type: recordWithExtra.audit_plan_db_type,
    db_type: recordWithExtra.db_type,
    schema_name: record.schema_name?.trim() || undefined,
    schema_meta_name: resolveSchemaMetaNameFromSqlManageInfo(
      recordWithExtra.info
    ),
    source: record.source,
    audit_result: record.audit_result
  };
};

export type ScanTaskRuleExceptionRecordInput = {
  sql_fingerprint?: string;
  fingerprint?: string;
  sql?: string;
  instance_id?: string;
  schema_name?: string;
  schema_meta_name?: string;
  audit_result?: IAuditResult[] | null;
};

export type ScanTaskRuleExceptionSourceContext = {
  auditPlanType?: string;
  auditPlanId?: string;
  auditPlanDesc?: string;
  instanceType?: string;
  instanceId?: string;
};

export type SqlAuditRuleExceptionSourceContext = {
  sqlAuditRecordId?: string;
  task?: Pick<
    IAuditTaskResV1,
    'instance_name' | 'instance_db_type' | 'task_id'
  >;
};

export const toScanTaskRuleExceptionRecord = (
  record?: ScanTaskRuleExceptionRecordInput | null,
  sourceContext?: ScanTaskRuleExceptionSourceContext
): SqlManageRuleExceptionRecord | undefined => {
  if (!record) {
    return undefined;
  }

  const sql_fingerprint =
    record.sql_fingerprint?.trim() || record.fingerprint?.trim();
  const sql = record.sql?.trim();

  if (!sql_fingerprint && !sql) {
    return undefined;
  }

  return {
    sql_fingerprint: sql_fingerprint || sql,
    sql,
    instance_id: record.instance_id?.trim() || sourceContext?.instanceId,
    db_type: sourceContext?.instanceType,
    schema_name: record.schema_name?.trim() || undefined,
    schema_meta_name: record.schema_meta_name?.trim() || undefined,
    source: {
      sql_source_type: sourceContext?.auditPlanType,
      sql_source_ids: sourceContext?.auditPlanId
        ? [sourceContext.auditPlanId]
        : undefined,
      sql_source_desc: sourceContext?.auditPlanDesc
    },
    audit_result: record.audit_result
  };
};

export type BuildBlacklistPrefillFromSqlManageOptions = {
  ruleName?: string;
  /** Row action entry: specific scope without pre-selecting rules */
  specificRuleScopeWithoutPreselect?: boolean;
  /**
   * SQL管控页「添加为审核SQL例外」专用（S1 §5.4）。
   * 库名+对象名均有值 → 预填 schema + object_name，跳过 fp_sql；
   * 缺任一侧 → 指纹回退（AC-001b）。
   * 禁止传给扫描详情抽屉 / 快捷审核 / 工单 / SqlAnalyze（AC-001a / AC-012）。
   */
  preferSchemaObjectMatch?: boolean;
};

const AUDIT_TASK_MATCH_PREFILL_SKIP_SOURCE_TYPES = new Set<string>([
  getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record,
  WorkflowStepResV2TypeEnum.create_workflow,
  WorkflowStepResV2TypeEnum.update_workflow
]);

export const shouldPrefillAuditTaskMatchConditions = (
  sqlSourceType?: string
): boolean => {
  const normalized = sqlSourceType?.trim();
  if (!normalized) {
    return false;
  }
  return !AUDIT_TASK_MATCH_PREFILL_SKIP_SOURCE_TYPES.has(normalized);
};

/** Coarse sql_source match content from SqlManage / quick-audit source type */
export const resolveSqlSourceMatchContent = (
  sqlSourceType?: string
): getAuditWhitelistV1FilterSqlSourceEnum | undefined => {
  const normalized = sqlSourceType?.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized === getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record) {
    return getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record;
  }
  if (shouldPrefillAuditTaskMatchConditions(normalized)) {
    return getAuditWhitelistV1FilterSqlSourceEnum.audit_plan;
  }
  return undefined;
};

export const resolveSqlSourceContentLabel = (
  content?: string
): string | undefined => {
  const normalized = content?.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized === getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record) {
    return t('ruleException.matchType.sqlSource.sql_audit_record');
  }
  if (normalized === getAuditWhitelistV1FilterSqlSourceEnum.audit_plan) {
    return t('ruleException.matchType.sqlSource.audit_plan');
  }
  return undefined;
};

export const extractTriggeredAuditResults = (
  auditResults?: IAuditResult[] | null
): IAuditResult[] => {
  if (!auditResults?.length) {
    return [];
  }

  return auditResults.filter((item) => {
    if (!item.rule_name?.trim()) {
      return false;
    }
    const level = getAuditResultLevel(item);
    if (
      !level ||
      PASS_AUDIT_LEVELS.includes(level as (typeof PASS_AUDIT_LEVELS)[number])
    ) {
      return false;
    }
    return true;
  });
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

export const buildSqlManageRuleExceptionContext = (
  record?: SqlManageRuleExceptionRecord | null
): ISqlManageRuleExceptionContext | undefined => {
  if (!record) {
    return undefined;
  }
  const sql_fingerprint = record.sql_fingerprint?.trim() || record.sql?.trim();
  if (!sql_fingerprint) {
    return undefined;
  }

  return {
    sql_fingerprint,
    instance_id: record.instance_id,
    instance_name: record.instance_name,
    db_type: resolveRuleExceptionDbType(
      undefined,
      undefined,
      record.audit_result,
      record.db_type ?? record.audit_plan_db_type
    ),
    source: record.source
  };
};

export const buildBlacklistPrefillFromSqlManage = (
  record?: SqlManageRuleExceptionRecord | null,
  options?: BuildBlacklistPrefillFromSqlManageOptions
): IAuditWhitelistResV1 | null => {
  const context = buildSqlManageRuleExceptionContext(record);
  if (!context) {
    return null;
  }

  const match_conditions: IMatchConditionReqV1[] = [];

  const objectName = record?.schema_meta_name?.trim();
  const schemaName = record?.schema_name?.trim();
  // AC-001：须库名与对象名均非空才走对象预填；缺一则 AC-001b 指纹回退
  const useSchemaObjectMatch =
    !!options?.preferSchemaObjectMatch && !!schemaName && !!objectName;

  if (useSchemaObjectMatch) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.schema,
      content: schemaName
    });
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.object_name,
      content: objectName
    });
  } else if (context.sql_fingerprint) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.fp_sql,
      content: context.sql_fingerprint
    });
  }

  if (context.instance_id) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.instance,
      content: context.instance_id
    });
  }
  const prefillAuditTaskMatch = shouldPrefillAuditTaskMatchConditions(
    context.source?.sql_source_type
  );
  if (prefillAuditTaskMatch && context.source?.sql_source_type) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.audit_task_type,
      content: context.source.sql_source_type
    });
  }
  if (prefillAuditTaskMatch && context.source?.sql_source_ids?.[0]) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.audit_task_id,
      content: context.source.sql_source_ids[0]
    });
  }

  const sqlSourceContent = resolveSqlSourceMatchContent(
    context.source?.sql_source_type
  );
  if (sqlSourceContent) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.sql_source,
      content: sqlSourceContent
    });
  }

  const dbType =
    context.db_type?.trim() ??
    resolveDbTypeFromAuditResults(record?.audit_result);
  if (dbType) {
    match_conditions.push({
      type: MatchConditionReqV1TypeEnum.db_type,
      content: dbType
    });
  }

  const basePrefill: IAuditWhitelistResV1 = {
    match_conditions: match_conditions.length ? match_conditions : undefined
  };

  const allTriggeredResults = extractTriggeredAuditResults(
    record?.audit_result
  );

  const ruleScopeDbType =
    context.db_type?.trim() ??
    resolveDbTypeFromAuditResults(record?.audit_result) ??
    resolveDbTypeFromAuditResults(allTriggeredResults);

  const ruleScopeDisplay = allTriggeredResults.map((item) => ({
    rule_name: item.rule_name,
    level: getAuditResultLevel(item),
    db_type: ruleScopeDbType ?? item.db_type,
    rule_desc: item.message
  }));

  const selectedRuleNames: string[] = [];
  if (options?.ruleName?.trim()) {
    selectedRuleNames.push(options.ruleName.trim());
  }

  if (options?.specificRuleScopeWithoutPreselect) {
    return {
      ...basePrefill,
      rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
      rule_scope: [] as unknown as IAuditWhitelistResV1['rule_scope'],
      rule_scope_display: allTriggeredResults.length
        ? ruleScopeDisplay
        : undefined
    };
  }

  if (!allTriggeredResults.length) {
    if (!selectedRuleNames.length) {
      return basePrefill;
    }

    const quickAddRuleScopeDbType =
      context.db_type?.trim() ??
      resolveDbTypeFromAuditResults(record?.audit_result);

    return {
      ...basePrefill,
      rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
      rule_scope:
        selectedRuleNames as unknown as IAuditWhitelistResV1['rule_scope'],
      rule_scope_display: selectedRuleNames.map((ruleName) => ({
        rule_name: ruleName,
        db_type: quickAddRuleScopeDbType
      }))
    };
  }

  return {
    ...basePrefill,
    rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum.specific,
    rule_scope:
      selectedRuleNames as unknown as IAuditWhitelistResV1['rule_scope'],
    rule_scope_display: ruleScopeDisplay
  };
};

export const buildAuditWhitelistPrefillFromSqlManage = (
  record?: SqlManageRuleExceptionRecord | null,
  options?: BuildBlacklistPrefillFromSqlManageOptions
): IAuditWhitelistResV1 | null => {
  const prefill = buildBlacklistPrefillFromSqlManage(record, options);
  return prefill as unknown as IAuditWhitelistResV1 | null;
};
