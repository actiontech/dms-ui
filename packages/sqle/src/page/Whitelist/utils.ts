import { AuditWhitelistFormFieldType } from './index.type';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { buildUpdateFormValuesFromRecord } from '../../components/RuleExceptionMatchConditions/utils';
import { rowsToAuditWhitelistBody } from '../RuleException/utils';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  splitRuleTipSelectValue
} from '../../hooks/useRuleTips';

export const auditWhitelistRecordToDisplayRecord = (
  record: IAuditWhitelistResV1
): IAuditWhitelistResV1 => ({
  ...record,
  rule_scope_mode:
    record.rule_scope_mode ?? AuditWhitelistResV1RuleScopeModeEnum.all
});

const resolveDbTypeForPayload = (
  values: AuditWhitelistFormFieldType
): string | undefined => {
  if (values.rule_scope_db_type?.trim()) {
    return values.rule_scope_db_type.trim();
  }

  const dbTypeFromRows = values.match_rows?.find(
    (row) => row.type === MatchConditionReqV1TypeEnum.db_type
  )?.content;

  return dbTypeFromRows?.trim() || undefined;
};

export const formValuesToAuditWhitelistPayload = (
  values: AuditWhitelistFormFieldType
) => {
  const ruleScopeSelectValues = values.rule_scope ?? [];
  const ruleNames = ruleScopeSelectValues.map((value) =>
    splitRuleTipSelectValue(value)
  );
  const dbType =
    values.rule_scope_mode === AuditWhitelistResV1RuleScopeModeEnum.specific
      ? resolveDbTypeForPayload(values)
      : undefined;

  return rowsToAuditWhitelistBody(
    values.match_rows,
    values.rule_scope_mode,
    ruleNames,
    values.desc,
    dbType
  );
};

export const auditWhitelistRecordToFormValues = (
  record?: IAuditWhitelistResV1 | null
): Partial<AuditWhitelistFormFieldType> => {
  if (!record) {
    return {};
  }

  const displayRecord = auditWhitelistRecordToDisplayRecord(record);
  return buildUpdateFormValuesFromRecord(displayRecord);
};

export const mapRuleScopeSelectValues = (
  dbType: string | undefined,
  ruleNames: string[]
) => {
  const normalizedDbType = dbType?.trim() ?? '';
  if (!normalizedDbType || !ruleNames.length) {
    return [];
  }
  return ruleNames.map(
    (ruleName) => `${normalizedDbType}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`
  );
};
