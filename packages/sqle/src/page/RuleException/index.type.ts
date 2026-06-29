import {
  IAuditResult,
  IBlacklistResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { BlacklistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type RuleScopeMode = BlacklistResV1RuleScopeModeEnum;

export interface IAuditResultWithExemption extends IAuditResult {
  is_exempted?: boolean;
  exception_id?: number | null;
}

export interface ISkippedByRuleExceptionItem {
  rule_name: string;
  level: string;
  message: string;
  created_by?: string;
  desc?: string;
  exception_id: number;
  created_at?: string;
}

export type IBlacklistResV1Extended = Omit<
  IBlacklistResV1,
  'rule_scope' | 'rule_scope_mode'
> & {
  rule_scope?: 'ALL' | string[];
  rule_scope_mode?: RuleScopeMode;
};

export const RULE_EXCEPTION_CONFLICT_CODE = 4012;
