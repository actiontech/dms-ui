import { t } from '../../locale';
import { AuditWhitelistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

/** Deep link query key for audit whitelist detail drawer */
export const AUDIT_WHITELIST_DETAIL_QUERY_KEY = 'exception_id';

export {
  AuditWhitelistMatchTypeDirection,
  AuditWhitelistSqlSourceContentDirection,
  AuditWhitelistSqlSourceContentOptions,
  AUDIT_WHITELIST_BASE_MATCH_TYPE_VALUES,
  AuditWhitelistBaseMatchTypeOptions,
  AuditWhitelistExtendedMatchTypeOptions,
  AuditWhitelistAllMatchTypeOptions,
  SqlManagementExceptionListFilterTypeOptions as AuditWhitelistListFilterTypeOptions
} from '../../components/RuleExceptionMatchConditions/index.data';

export const AuditWhitelistRuleScopeModeOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: AuditWhitelistResV1RuleScopeModeEnum.all
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: AuditWhitelistResV1RuleScopeModeEnum.specific
  }
];

export const AuditWhitelistRuleScopeFilterOptions = [
  {
    label: t('ruleException.form.ruleScopeAll'),
    value: 'all'
  },
  {
    label: t('ruleException.form.ruleScopeSpecific'),
    value: 'specific'
  }
];
