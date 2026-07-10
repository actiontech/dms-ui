import {
  IAuditResult,
  IAuditWhitelistResV1,
  ISkippedByRuleExceptionItem
} from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditWhitelistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type RuleScopeMode = AuditWhitelistResV1RuleScopeModeEnum;

export type { ISkippedByRuleExceptionItem };

export type IAuditWhitelistResV1Extended = Omit<
  IAuditWhitelistResV1,
  'rule_scope' | 'rule_scope_mode'
> & {
  rule_scope?: 'ALL' | string[];
  rule_scope_mode?: RuleScopeMode;
};

export const RULE_EXCEPTION_CONFLICT_CODE = 4012;
