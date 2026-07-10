import { PROJECT_ROUTER_PARAM } from '@actiontech/shared/lib/data/common';
import {
  IAuditWhitelistResV1,
  IMatchConditionDisplayV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { MatchConditionReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  normalizeMatchConditionsForRead,
  normalizeMatchConditionTypeForRead
} from './matchCondition';
import { resolveSqlSourceContentLabel } from './prefill';

export const buildRuleExceptionDetailPath = (
  projectID: string,
  auditWhitelistId: number | string,
  queryKey = 'exception_id'
) => `/sqle/project/${projectID}/whitelist?${queryKey}=${auditWhitelistId}`;

export const PROJECT_RULE_EXCEPTION_ROUTE = `${PROJECT_ROUTER_PARAM}/sql-management-exception`;

export type FormattedMatchModeItem = {
  type?: string;
  typeLabel: string;
  content?: string;
  navigatePath?: string;
};

const isAuditTaskIdDisplayType = (type?: string): boolean => {
  return (
    normalizeMatchConditionTypeForRead(type) ===
    MatchConditionReqV1TypeEnum.audit_task_id
  );
};

const isAuditTaskTypeDisplayType = (type?: string): boolean => {
  return (
    normalizeMatchConditionTypeForRead(type) ===
    MatchConditionReqV1TypeEnum.audit_task_type
  );
};

const isSqlSourceDisplayType = (type?: string): boolean => {
  return (
    normalizeMatchConditionTypeForRead(type) ===
    MatchConditionReqV1TypeEnum.sql_source
  );
};

export type FormatMatchModeOptions = {
  resolveAuditTaskTypeLabel?: (content: string) => string | undefined;
};

const resolveMatchModeContent = (
  type: string | undefined,
  content: string | undefined,
  contentDisplay: string | undefined,
  resolveAuditTaskTypeLabel?: (content: string) => string | undefined
): string | undefined => {
  const rawContent = content?.trim();
  const display = contentDisplay?.trim();

  if (isAuditTaskTypeDisplayType(type) && rawContent) {
    if (display && display !== rawContent) {
      return display;
    }
    return resolveAuditTaskTypeLabel?.(rawContent) ?? display ?? rawContent;
  }

  if (isSqlSourceDisplayType(type) && rawContent) {
    if (display && display !== rawContent) {
      return display;
    }
    return resolveSqlSourceContentLabel(rawContent) ?? display ?? rawContent;
  }

  return display ?? rawContent;
};

const buildMatchConditionsDisplayRows = (
  item: IAuditWhitelistResV1
): IMatchConditionDisplayV1[] => {
  if (item.match_conditions_display?.length) {
    return item.match_conditions_display;
  }
  return normalizeMatchConditionsForRead(item.match_conditions).map(
    (condition) => ({
      type: condition.type,
      content: condition.content
    })
  );
};

export const formatMatchModeItems = (
  item: IAuditWhitelistResV1
): Array<{ type?: string; content?: string }> => {
  return normalizeMatchConditionsForRead(item.match_conditions).map(
    (condition) => ({
      type: condition.type,
      content: condition.content
    })
  );
};

export const formatMatchMode = (
  item: IAuditWhitelistResV1,
  getTypeLabel: (type?: string) => string,
  options?: FormatMatchModeOptions
): FormattedMatchModeItem[] => {
  const { resolveAuditTaskTypeLabel } = options ?? {};
  const rows: FormattedMatchModeItem[] = [];

  buildMatchConditionsDisplayRows(item).forEach((row) => {
    const normalizedType = normalizeMatchConditionTypeForRead(row.type);
    rows.push({
      type: normalizedType,
      typeLabel: getTypeLabel(normalizedType),
      content: resolveMatchModeContent(
        normalizedType,
        row.content,
        row.content_display,
        resolveAuditTaskTypeLabel
      ),
      navigatePath: isAuditTaskIdDisplayType(normalizedType)
        ? row.navigate_path
        : undefined
    });
  });

  return rows;
};

export const formatMatchModeTypeLabels = (
  item: IAuditWhitelistResV1,
  getTypeLabel: (type?: string) => string
): string[] => {
  const seen = new Set<string>();
  const labels: string[] = [];
  const addType = (type?: string) => {
    if (!type || seen.has(type)) {
      return;
    }
    seen.add(type);
    labels.push(getTypeLabel(type));
  };

  (item.match_conditions_display ?? []).forEach((row) => addType(row.type));
  normalizeMatchConditionsForRead(item.match_conditions).forEach((row) =>
    addType(row.type)
  );

  return labels;
};
