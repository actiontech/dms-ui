import { t } from '../../locale';
import {
  MatchConditionReqV1TypeEnum,
  AuditWhitelistResV1RuleScopeModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getAuditWhitelistV1FilterTypeEnum,
  getAuditWhitelistV1FilterRuleScopeModeEnum,
  getAuditWhitelistV1FilterSqlSourceEnum
} from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';

export const AuditWhitelistMatchTypeDirection: Record<
  | 'sql'
  | 'fp_sql'
  | MatchConditionReqV1TypeEnum.instance
  | MatchConditionReqV1TypeEnum.audit_task_type
  | MatchConditionReqV1TypeEnum.audit_task_id
  | MatchConditionReqV1TypeEnum.db_type
  | MatchConditionReqV1TypeEnum.sql_source,
  string
> = {
  sql: t('ruleException.matchType.sql'),
  fp_sql: t('ruleException.matchType.fingerPrint'),
  [MatchConditionReqV1TypeEnum.instance]: t('ruleException.matchType.instance'),
  [MatchConditionReqV1TypeEnum.audit_task_type]: t(
    'ruleException.matchType.audit_task_type'
  ),
  [MatchConditionReqV1TypeEnum.audit_task_id]: t(
    'ruleException.matchType.audit_task_id'
  ),
  [MatchConditionReqV1TypeEnum.db_type]: t('ruleException.matchType.db_type'),
  [MatchConditionReqV1TypeEnum.sql_source]: t(
    'ruleException.matchType.sql_source'
  )
};

export const AuditWhitelistSqlSourceContentDirection: Record<
  getAuditWhitelistV1FilterSqlSourceEnum,
  string
> = {
  [getAuditWhitelistV1FilterSqlSourceEnum.sql_audit_record]: t(
    'ruleException.matchType.sqlSource.sql_audit_record'
  ),
  [getAuditWhitelistV1FilterSqlSourceEnum.audit_plan]: t(
    'ruleException.matchType.sqlSource.audit_plan'
  )
};

export const AuditWhitelistSqlSourceContentOptions = (
  Object.values(
    getAuditWhitelistV1FilterSqlSourceEnum
  ) as getAuditWhitelistV1FilterSqlSourceEnum[]
).map((value) => ({
  label: AuditWhitelistSqlSourceContentDirection[value],
  value
}));

/** @deprecated internal use only; prefer AuditWhitelistAllMatchTypeOptions */
export const AUDIT_WHITELIST_BASE_MATCH_TYPE_VALUES = [
  'sql',
  'fp_sql'
] as const;

/** @deprecated use AuditWhitelistAllMatchTypeOptions */
export const AuditWhitelistBaseMatchTypeOptions =
  AUDIT_WHITELIST_BASE_MATCH_TYPE_VALUES.map((value) => ({
    label: AuditWhitelistMatchTypeDirection[value],
    value
  }));

export const AuditWhitelistExtendedMatchTypeOptions = [
  MatchConditionReqV1TypeEnum.instance,
  MatchConditionReqV1TypeEnum.audit_task_type,
  MatchConditionReqV1TypeEnum.audit_task_id,
  MatchConditionReqV1TypeEnum.db_type,
  MatchConditionReqV1TypeEnum.sql_source,
  MatchConditionReqV1TypeEnum.fp_sql,
  MatchConditionReqV1TypeEnum.sql
].map((value) => ({
  label: AuditWhitelistMatchTypeDirection[value],
  value
}));

export const AuditWhitelistAllMatchTypeOptions = [
  ...AUDIT_WHITELIST_BASE_MATCH_TYPE_VALUES,
  MatchConditionReqV1TypeEnum.instance,
  MatchConditionReqV1TypeEnum.audit_task_type,
  MatchConditionReqV1TypeEnum.audit_task_id,
  MatchConditionReqV1TypeEnum.db_type,
  MatchConditionReqV1TypeEnum.sql_source
].map((value) => ({
  label:
    AuditWhitelistMatchTypeDirection[
      value as keyof typeof AuditWhitelistMatchTypeDirection
    ],
  value
}));

/** @deprecated use AuditWhitelistMatchTypeDirection */
export const SqlManagementExceptionMatchTypeDirection =
  AuditWhitelistMatchTypeDirection;

/** @deprecated use AuditWhitelistBaseMatchTypeOptions */
export const SqlManagementExceptionBaseMatchTypeOptions =
  AuditWhitelistBaseMatchTypeOptions;

/** List filter: audit whitelist filter_type values */
export const SqlManagementExceptionListFilterTypeOptions = (
  Object.values(
    getAuditWhitelistV1FilterTypeEnum
  ) as getAuditWhitelistV1FilterTypeEnum[]
).map((value) => ({
  label:
    AuditWhitelistMatchTypeDirection[
      value as keyof typeof AuditWhitelistMatchTypeDirection
    ],
  value
}));

/** @deprecated use AuditWhitelistExtendedMatchTypeOptions */
export const SqlManagementExceptionExtendedMatchTypeOptions =
  AuditWhitelistExtendedMatchTypeOptions;

/** @deprecated use AuditWhitelistAllMatchTypeOptions */
export const SqlManagementExceptionAllMatchTypeOptions =
  AuditWhitelistAllMatchTypeOptions;

/** @deprecated use AuditWhitelistBaseMatchTypeOptions */
export const SqlManagementExceptionMatchTypeOptions =
  AuditWhitelistBaseMatchTypeOptions;

export const SqlManagementExceptionRuleScopeModeOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: AuditWhitelistResV1RuleScopeModeEnum.all
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: AuditWhitelistResV1RuleScopeModeEnum.specific
  }
];

export const SqlManagementExceptionRuleScopeFilterOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: getAuditWhitelistV1FilterRuleScopeModeEnum.all
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: getAuditWhitelistV1FilterRuleScopeModeEnum.specific
  }
];
