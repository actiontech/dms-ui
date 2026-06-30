import { TFunction } from 'i18next';
import { SqlManagementExceptionFormFieldType } from './index.type';
import {
  IBlacklistResV1,
  IInstanceAuditPlanResV1,
  IRuleTips
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  blacklistToRows,
  formatMatchModeItems,
  rowsToBlacklistBody
} from '../RuleException/utils';
import {
  blacklistRecordToExtended,
  MATCH_CONDITION_READ_TYPE_SOURCE,
  MATCH_CONDITION_READ_TYPE_SOURCE_ID,
  normalizeRuleScopeList
} from '../RuleException/index.data';
import {
  BlacklistResV1RuleScopeModeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { GetSqlManageListV2FilterSourceEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { SQLAuditRecordListUrlParamsKey } from '../SqlManagement/component/SQLEEIndex/index.data';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  extractDbTypeFromRuleSelectValue,
  splitRuleTipSelectValue
} from '../../hooks/useRuleTips';

export type AuditTaskMatchInfo = {
  auditTaskType?: string;
  auditTaskId?: string;
};

export const isAuditTaskIdMatchType = (type?: string): boolean => {
  return (
    type === MatchConditionReqV1TypeEnum.audit_task_id ||
    type === MATCH_CONDITION_READ_TYPE_SOURCE_ID
  );
};

export const extractAuditTaskMatchInfo = (
  record: IBlacklistResV1
): AuditTaskMatchInfo => {
  const info: AuditTaskMatchInfo = {};
  formatMatchModeItems(record).forEach((row) => {
    if (
      row.type === MatchConditionReqV1TypeEnum.audit_task_type ||
      row.type === MATCH_CONDITION_READ_TYPE_SOURCE
    ) {
      info.auditTaskType = row.content;
    }
    if (isAuditTaskIdMatchType(row.type)) {
      info.auditTaskId = row.content;
    }
  });
  return info;
};

export const formatAuditTaskDisplayLabel = (
  plan: IInstanceAuditPlanResV1 | undefined,
  auditTaskId: string | undefined,
  t: TFunction
): string => {
  if (plan) {
    const instanceName =
      plan.instance_name ||
      t('managementConf.list.table.column.staticScanType');
    return `${instanceName} (#${plan.instance_audit_plan_id ?? ''})`;
  }
  return auditTaskId ?? '-';
};

export const buildAuditTaskNavigatePath = (
  projectID: string,
  auditTaskType?: string,
  auditTaskId?: string
): string | undefined => {
  if (!auditTaskId) {
    return undefined;
  }
  if (auditTaskType === GetSqlManageListV2FilterSourceEnum.sql_audit_record) {
    return `/sqle/project/${projectID}/sql-audit?${SQLAuditRecordListUrlParamsKey.SQLAuditRecordID}=${auditTaskId}`;
  }
  return `/sqle/project/${projectID}/sql-management-conf/${auditTaskId}`;
};

export const findInstanceAuditPlanById = (
  plans: IInstanceAuditPlanResV1[] | undefined,
  auditTaskId?: string
): IInstanceAuditPlanResV1 | undefined => {
  if (!auditTaskId || !plans?.length) {
    return undefined;
  }
  return plans.find(
    (plan) => `${plan.instance_audit_plan_id ?? ''}` === auditTaskId
  );
};

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

  return {
    ...baseValues,
    rule_scope_db_type: ruleScopeDbType,
    rule_scope: mappedRuleScope
  };
};
