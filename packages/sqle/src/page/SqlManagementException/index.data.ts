import { t } from '../../locale';
import {
  BlacklistResV1TypeEnum,
  MatchConditionReqV1TypeEnum,
  BlacklistResV1RuleScopeModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBlacklistV1FilterRuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/blacklist/index.enum';
import { BASE_MATCH_TYPE_VALUES } from '../RuleException/index.data';

export const SqlManagementExceptionMatchTypeDirection: Record<
  | BlacklistResV1TypeEnum
  | MatchConditionReqV1TypeEnum.audit_task_type
  | MatchConditionReqV1TypeEnum.audit_task_id
  | MatchConditionReqV1TypeEnum.db_type,
  string
> = {
  [BlacklistResV1TypeEnum.sql]: t('sqlManagementException.matchType.sql'),
  [BlacklistResV1TypeEnum.fp_sql]: t(
    'sqlManagementException.matchType.fingerPrint'
  ),
  [BlacklistResV1TypeEnum.ip]: t('sqlManagementException.matchType.ip'),
  [BlacklistResV1TypeEnum.cidr]: t('sqlManagementException.matchType.cidr'),
  [BlacklistResV1TypeEnum.host]: t('sqlManagementException.matchType.host'),
  [BlacklistResV1TypeEnum.instance]: t(
    'sqlManagementException.matchType.instance'
  ),
  [BlacklistResV1TypeEnum.db_user]: t(
    'sqlManagementException.matchType.db_user'
  ),
  [MatchConditionReqV1TypeEnum.audit_task_type]: t(
    'sqlManagementException.matchType.audit_task_type'
  ),
  [MatchConditionReqV1TypeEnum.audit_task_id]: t(
    'sqlManagementException.matchType.audit_task_id'
  ),
  [MatchConditionReqV1TypeEnum.db_type]: t(
    'sqlManagementException.matchType.db_type'
  )
};

const createMatchTypeOption = (value: BlacklistResV1TypeEnum) => ({
  label: SqlManagementExceptionMatchTypeDirection[value],
  value
});

export const SqlManagementExceptionBaseMatchTypeOptions =
  BASE_MATCH_TYPE_VALUES.map((value) =>
    createMatchTypeOption(value as unknown as BlacklistResV1TypeEnum)
  );

export const SqlManagementExceptionExtendedMatchTypeOptions = [
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
].map((value) => ({
  label: SqlManagementExceptionMatchTypeDirection[value],
  value
}));

/** All match types shown in every match-row dropdown (primary + extended). */
export const SqlManagementExceptionAllMatchTypeOptions = [
  ...BASE_MATCH_TYPE_VALUES,
  MatchConditionReqV1TypeEnum.audit_task_type,
  MatchConditionReqV1TypeEnum.audit_task_id,
  MatchConditionReqV1TypeEnum.db_type
].map((value) => ({
  label:
    SqlManagementExceptionMatchTypeDirection[
      value as unknown as keyof typeof SqlManagementExceptionMatchTypeDirection
    ],
  value
}));

/** @deprecated use SqlManagementExceptionBaseMatchTypeOptions */
export const SqlManagementExceptionMatchTypeOptions =
  SqlManagementExceptionBaseMatchTypeOptions;

export const SqlManagementExceptionRuleScopeModeOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: BlacklistResV1RuleScopeModeEnum.all
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: BlacklistResV1RuleScopeModeEnum.specific
  }
];

export const SqlManagementExceptionRuleScopeFilterOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: getBlacklistV1FilterRuleScopeModeEnum.all
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: getBlacklistV1FilterRuleScopeModeEnum.specific
  }
];
