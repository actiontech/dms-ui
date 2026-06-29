import { FormInstance } from 'antd';
import {
  BlacklistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum,
  CreateBlacklistReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
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
};

export type MatchRowFormType = MatchRow;

export type { MatchConditionReqV1TypeEnum, CreateBlacklistReqV1TypeEnum };
