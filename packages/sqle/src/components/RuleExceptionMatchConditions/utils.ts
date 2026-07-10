import { AuditWhitelistFormFieldType } from './index.type';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  auditWhitelistToRows,
  rowsToAuditWhitelistBody,
  resolveDbTypeFromAuditResults
} from '../../page/RuleException/utils';
import {
  auditWhitelistRecordToExtended,
  normalizeRuleScopeList
} from '../../page/RuleException/index.data';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  extractDbTypeFromRuleSelectValue,
  splitRuleTipSelectValue
} from '../../hooks/useRuleTips';

const resolveDbTypeForPayload = (
  values: AuditWhitelistFormFieldType
): string | undefined => {
  if (values.rule_scope_db_type?.trim()) {
    return values.rule_scope_db_type.trim();
  }

  const dbTypeFromRows = values.match_rows?.find(
    (row) => row.type === MatchConditionReqV1TypeEnum.db_type
  )?.content;

  if (dbTypeFromRows?.trim()) {
    return dbTypeFromRows.trim();
  }

  const ruleScopeSelectValues = values.rule_scope ?? [];
  const dbTypes = new Set(
    ruleScopeSelectValues
      .map((value) => extractDbTypeFromRuleSelectValue(value))
      .filter((value): value is string => !!value)
  );

  if (dbTypes.size === 1) {
    return [...dbTypes][0];
  }

  return undefined;
};

export const formValuesToBlacklistPayload = (
  values: AuditWhitelistFormFieldType
) => {
  const ruleScopeSelectValues = values.rule_scope ?? [];
  const ruleNames = ruleScopeSelectValues.map((value) =>
    splitRuleTipSelectValue(value)
  );
  const dbType =
    values.rule_scope_mode === AuditWhitelistResV1RuleScopeModeEnum.specific
      ? resolveDbTypeForPayload({
          ...values,
          rule_scope: ruleScopeSelectValues
        })
      : undefined;

  return rowsToAuditWhitelistBody(
    values.match_rows,
    values.rule_scope_mode,
    ruleNames,
    values.desc,
    dbType
  );
};

export const blacklistRecordToFormValues = (
  record?: IAuditWhitelistResV1 | null
): Partial<AuditWhitelistFormFieldType> => {
  if (!record) {
    return {};
  }
  const extended = auditWhitelistRecordToExtended(record);
  const rows = auditWhitelistToRows(record);
  const ruleScopeMode =
    extended.rule_scope_mode ?? AuditWhitelistResV1RuleScopeModeEnum.all;
  let ruleScopeDbType: string | undefined;
  let matchRows = rows;

  if (ruleScopeMode === AuditWhitelistResV1RuleScopeModeEnum.specific) {
    const dbTypeRowIndex = rows.findIndex(
      (row) => row.type === MatchConditionReqV1TypeEnum.db_type
    );
    if (dbTypeRowIndex >= 0) {
      ruleScopeDbType = rows[dbTypeRowIndex].content;
      matchRows = rows.filter((_, index) => index !== dbTypeRowIndex);
    }
  }

  return {
    match_rows: matchRows,
    desc: extended.desc,
    rule_scope_mode: ruleScopeMode,
    rule_scope_db_type: ruleScopeDbType,
    rule_scope: normalizeRuleScopeList(extended.rule_scope)
  };
};

export const buildUpdateFormValuesFromRecord = (
  record: IAuditWhitelistResV1 | null | undefined
): Partial<AuditWhitelistFormFieldType> => {
  if (!record) {
    return {};
  }

  const baseValues = blacklistRecordToFormValues(record);
  const ruleNames = baseValues.rule_scope ?? [];
  let ruleScopeDbType = baseValues.rule_scope_db_type;

  if (!ruleScopeDbType) {
    for (const condition of record.match_conditions ?? []) {
      if (
        condition.type === MatchConditionReqV1TypeEnum.db_type &&
        condition.content?.trim()
      ) {
        ruleScopeDbType = condition.content.trim();
        break;
      }
    }
  }

  if (!ruleScopeDbType && record.rule_scope_display?.length) {
    ruleScopeDbType = resolveDbTypeFromAuditResults(record.rule_scope_display);
  }

  if (!ruleScopeDbType) {
    for (const item of record.rule_scope_display ?? []) {
      if (item.db_type?.trim()) {
        ruleScopeDbType = item.db_type.trim();
        break;
      }
    }
  }

  const normalizedDbType = ruleScopeDbType?.trim() ?? '';
  const mappedRuleScope =
    normalizedDbType && ruleNames.length
      ? ruleNames.map(
          (ruleName) =>
            `${normalizedDbType}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`
        )
      : [];

  if (
    mappedRuleScope.length === 0 &&
    ruleNames.length > 0 &&
    record.rule_scope_display?.length
  ) {
    record.rule_scope_display.forEach((item) => {
      const ruleName = item.rule_name?.trim();
      if (!ruleName || !ruleNames.includes(ruleName)) {
        return;
      }
      const dbType = item.db_type?.trim() ?? normalizedDbType;
      if (!dbType) {
        return;
      }
      mappedRuleScope.push(
        `${dbType}${DB_TYPE_RULE_NAME_SEPARATOR}${ruleName}`
      );
    });
  }

  return {
    ...baseValues,
    rule_scope_db_type: ruleScopeDbType,
    rule_scope: mappedRuleScope
  };
};
