import {
  IAuditWhitelistResV1,
  IMatchConditionReqV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  AuditWhitelistResV1RuleScopeModeEnum,
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { RuleScopeMode } from './index.type';
import {
  isPrimaryBlacklistMatchType,
  MatchRow,
  normalizeMatchConditionsForRead,
  normalizeMatchConditionsForWrite,
  normalizeMatchRowsOrder
} from './matchCondition';
import { normalizeRuleScopeForWrite } from './ruleScope';

export const auditWhitelistToRows = (
  item: IAuditWhitelistResV1
): MatchRow[] => {
  const rows: MatchRow[] = normalizeMatchConditionsForRead(
    item.match_conditions
  )
    .filter(
      (
        condition
      ): condition is IMatchConditionReqV1 & {
        type: MatchConditionReqV1TypeEnum;
      } => !!condition.type
    )
    .map((condition) => ({
      type: condition.type,
      content: condition.content ?? ''
    }));

  if (!rows.length) {
    return [{ type: CreateBlacklistReqV1TypeEnum.sql, content: '' }];
  }
  return rows;
};

const appendDbTypeMatchCondition = (
  matchConditions: IMatchConditionReqV1[] | undefined,
  dbType?: string
): IMatchConditionReqV1[] | undefined => {
  if (!dbType?.trim()) {
    return matchConditions;
  }
  const conditions = [...(matchConditions ?? [])];
  const hasDbType = conditions.some(
    (item) => item.type === MatchConditionReqV1TypeEnum.db_type
  );
  if (!hasDbType) {
    conditions.push({
      type: MatchConditionReqV1TypeEnum.db_type,
      content: dbType.trim()
    });
  }
  return conditions.length ? conditions : undefined;
};

export const rowsToBlacklistBody = (
  rows: MatchRow[],
  scopeMode: RuleScopeMode,
  selectedRules?: string[],
  desc?: string,
  dbType?: string,
  isPrimaryType: (type?: string) => boolean = isPrimaryBlacklistMatchType
) => {
  const [firstRow, ...restRows] = normalizeMatchRowsOrder(rows, isPrimaryType);
  let matchConditions = normalizeMatchConditionsForWrite(
    restRows.map((row) => ({
      type: row.type as MatchConditionReqV1TypeEnum,
      content: row.content
    }))
  );
  if (scopeMode === AuditWhitelistResV1RuleScopeModeEnum.specific) {
    matchConditions = appendDbTypeMatchCondition(matchConditions, dbType);
  }
  return {
    type: firstRow.type as CreateBlacklistReqV1TypeEnum,
    content: firstRow.content,
    desc,
    match_conditions: matchConditions,
    rule_scope: normalizeRuleScopeForWrite(scopeMode, selectedRules)
  };
};

export const rowsToAuditWhitelistBody = (
  rows: MatchRow[],
  scopeMode: RuleScopeMode,
  selectedRules?: string[],
  desc?: string,
  dbType?: string
) => {
  let matchConditions = normalizeMatchConditionsForWrite(
    rows.map((row) => ({
      type: row.type as MatchConditionReqV1TypeEnum,
      content: row.content
    }))
  );
  if (scopeMode === AuditWhitelistResV1RuleScopeModeEnum.specific) {
    matchConditions = appendDbTypeMatchCondition(matchConditions, dbType);
  }
  return {
    desc,
    match_conditions: matchConditions?.length ? matchConditions : undefined,
    rule_scope: normalizeRuleScopeForWrite(scopeMode, selectedRules)
  };
};
