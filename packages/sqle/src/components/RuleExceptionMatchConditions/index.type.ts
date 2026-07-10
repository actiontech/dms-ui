import { FormInstance } from 'antd';
import React from 'react';
import { SelectProps } from 'antd';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum,
  CreateBlacklistReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IRuleScopeDisplayV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { MatchRow } from '../../page/RuleException/utils';

export type AuditWhitelistFormFieldType = {
  match_rows: MatchRow[];
  desc?: string;
  rule_scope_mode: AuditWhitelistResV1RuleScopeModeEnum;
  rule_scope_db_type?: string;
  rule_scope?: string[];
};

export type AuditWhitelistFormProps = {
  form: FormInstance<AuditWhitelistFormFieldType>;
  isUpdate?: boolean;
  triggeredRuleScopeDisplay?: IRuleScopeDisplayV1[];
  savedRuleScopeDisplay?: IRuleScopeDisplayV1[];
  dbTypeReadonly?: boolean;
  dbTypeOptions?: SelectProps['options'];
  dbTypeLoading?: boolean;
  ruleScopeLoading?: boolean;
  ruleScopeError?: Error | unknown;
  onRuleScopeSearch?: (keyword: string) => void;
  onRuleScopeReload?: () => void;
  generateFlatRuleOptionsByDbType?: (
    dbType?: string,
    savedRuleScopeDisplay?: IRuleScopeDisplayV1[]
  ) => Array<{ label: string; value: string }>;
  ruleNameDescMap?: Map<string, string>;
  submitErrorFields?: Array<{ name: React.Key[]; errors: string[] }>;
  onValuesChangeClearError?: () => void;
};

export type MatchRowFormType = MatchRow;

export type { MatchConditionReqV1TypeEnum, CreateBlacklistReqV1TypeEnum };
