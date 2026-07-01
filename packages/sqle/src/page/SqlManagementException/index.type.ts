import { FormInstance } from 'antd';
import React from 'react';
import {
  BlacklistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum,
  CreateBlacklistReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IRuleScopeDisplayV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { MatchRow } from '../RuleException/utils';

export type SqlManagementExceptionFormFieldType = {
  match_rows: MatchRow[];
  desc?: string;
  rule_scope_mode: BlacklistResV1RuleScopeModeEnum;
  rule_scope_db_type?: string;
  rule_scope?: string[];
};

export type SqlManagementExceptionFormProps = {
  form: FormInstance<SqlManagementExceptionFormFieldType>;
  isUpdate?: boolean;
  /** Create-from-SQL-manage row: limit rule_scope to triggered audit results */
  triggeredRuleScopeDisplay?: IRuleScopeDisplayV1[];
  ruleTipsLoading?: boolean;
  dbTypeOptions?: Array<{ label: string; value: string }>;
  generateFlatRuleOptionsByDbType?: (
    dbType?: string
  ) => Array<{ label: React.ReactNode; value: string }>;
  ruleNameDescMap?: Map<string, string>;
};

export type MatchRowFormType = MatchRow;

export type { MatchConditionReqV1TypeEnum, CreateBlacklistReqV1TypeEnum };
