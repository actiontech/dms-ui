import { SqlManagementExceptionFormFieldType } from './index.type';
import {
  IBlacklistResV1,
  IRuleTips
} from '@actiontech/shared/lib/api/sqle/service/common';
import { blacklistToRows, rowsToBlacklistBody } from '../RuleException/utils';
import {
  blacklistRecordToExtended,
  normalizeRuleScopeList
} from '../RuleException/index.data';
import {
  BlacklistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  extractDbTypeFromRuleSelectValue,
  splitRuleTipSelectValue
} from '../../hooks/useRuleTips';

const resolveDbTypeForPayload = (
  values: SqlManagementExceptionFormFieldType
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
  values: SqlManagementExceptionFormFieldType
) => {
  const ruleScopeSelectValues = values.rule_scope ?? [];
  const ruleNames = ruleScopeSelectValues.map((value) =>
    splitRuleTipSelectValue(value)
  );
  const dbType =
    values.rule_scope_mode === BlacklistResV1RuleScopeModeEnum.specific
      ? resolveDbTypeForPayload({
          ...values,
          rule_scope: ruleScopeSelectValues
        })
      : undefined;

  return rowsToBlacklistBody(
    values.match_rows,
    values.rule_scope_mode,
    ruleNames,
    values.desc,
    dbType
  );
};

export const blacklistRecordToFormValues = (
  record?: IBlacklistResV1 | null
): Partial<SqlManagementExceptionFormFieldType> => {
  if (!record) {
    return {};
  }
  const extended = blacklistRecordToExtended(record);
  const rows = blacklistToRows(record);
  const ruleScopeMode =
    extended.rule_scope_mode ?? BlacklistResV1RuleScopeModeEnum.all;
  let ruleScopeDbType: string | undefined;
  let matchRows = rows;

  if (ruleScopeMode === BlacklistResV1RuleScopeModeEnum.specific) {
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
  record: IBlacklistResV1 | null | undefined,
  ruleTips: IRuleTips[]
): Partial<SqlManagementExceptionFormFieldType> => {
  if (!record) {
    return {};
  }

  const baseValues = blacklistRecordToFormValues(record);
  const ruleNames = baseValues.rule_scope ?? [];
  let ruleScopeDbType = baseValues.rule_scope_db_type;
  const mappedRuleScope: string[] = [];

  ruleTips.forEach((group) => {
    group.rule?.forEach((rule) => {
      if (rule.rule_name && ruleNames.includes(rule.rule_name)) {
        mappedRuleScope.push(
          `${group.db_type ?? ''}${DB_TYPE_RULE_NAME_SEPARATOR}${
            rule.rule_name
          }`
        );
        if (!ruleScopeDbType && group.db_type) {
          ruleScopeDbType = group.db_type;
        }
      }
    });
  });

  if (!ruleScopeDbType && record.rule_scope_display?.[0]?.db_type?.trim()) {
    ruleScopeDbType = record.rule_scope_display[0].db_type.trim();
  }

  if (
    mappedRuleScope.length === 0 &&
    ruleNames.length > 0 &&
    record.rule_scope_display?.length
  ) {
    record.rule_scope_display.forEach((item) => {
      if (!item.rule_name?.trim()) {
        return;
      }
      const dbType = item.db_type?.trim() ?? ruleScopeDbType ?? '';
      mappedRuleScope.push(
        `${dbType}${DB_TYPE_RULE_NAME_SEPARATOR}${item.rule_name}`
      );
    });
  }

  return {
    ...baseValues,
    rule_scope_db_type: ruleScopeDbType,
    rule_scope: mappedRuleScope
  };
};
