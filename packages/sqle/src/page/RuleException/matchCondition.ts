import { IMatchConditionReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  CreateBlacklistReqV1TypeEnum,
  MatchConditionReqV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  MATCH_CONDITION_READ_TYPE_SOURCE,
  MATCH_CONDITION_READ_TYPE_SOURCE_ID
} from './constants';

export const normalizeMatchConditionTypeForRead = (
  type?: string
): MatchConditionReqV1TypeEnum | string | undefined => {
  if (!type) {
    return type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE) {
    return MatchConditionReqV1TypeEnum.audit_task_type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE_ID) {
    return MatchConditionReqV1TypeEnum.audit_task_id;
  }
  return type;
};

const normalizeMatchConditionTypeForWrite = (
  type: MatchConditionReqV1TypeEnum | string
): MatchConditionReqV1TypeEnum | string => {
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE) {
    return MatchConditionReqV1TypeEnum.audit_task_type;
  }
  if (type === MATCH_CONDITION_READ_TYPE_SOURCE_ID) {
    return MatchConditionReqV1TypeEnum.audit_task_id;
  }
  return type;
};

export const normalizeMatchConditionsForRead = (
  matchConditions?: IMatchConditionReqV1[] | null
): IMatchConditionReqV1[] => {
  return (matchConditions ?? []).map((item) => ({
    ...item,
    type: normalizeMatchConditionTypeForRead(
      item.type
    ) as MatchConditionReqV1TypeEnum
  }));
};

export const normalizeMatchConditionsForWrite = (
  matchConditions?: IMatchConditionReqV1[] | null
): IMatchConditionReqV1[] | undefined => {
  if (!matchConditions?.length) {
    return undefined;
  }
  return matchConditions.map((item) => ({
    content: item.content,
    type: normalizeMatchConditionTypeForWrite(
      item.type ?? ''
    ) as MatchConditionReqV1TypeEnum
  }));
};

export type MatchRow = {
  type: CreateBlacklistReqV1TypeEnum | MatchConditionReqV1TypeEnum;
  content: string;
};

const PRIMARY_BLACKLIST_MATCH_TYPES = new Set<string>(
  Object.values(CreateBlacklistReqV1TypeEnum)
);

export const isPrimaryBlacklistMatchType = (
  type?: string
): type is CreateBlacklistReqV1TypeEnum => {
  if (!type) {
    return false;
  }
  return PRIMARY_BLACKLIST_MATCH_TYPES.has(type);
};

/** Move the first primary match type row to index 0 for API payload shape. */
export const normalizeMatchRowsOrder = (
  rows: MatchRow[],
  isPrimaryType: (type?: string) => boolean = isPrimaryBlacklistMatchType
): MatchRow[] => {
  if (rows.length <= 1) {
    return rows;
  }
  const firstPrimaryIndex = rows.findIndex((row) =>
    isPrimaryType(row.type as string)
  );
  if (firstPrimaryIndex <= 0) {
    return rows;
  }
  return [
    rows[firstPrimaryIndex],
    ...rows.slice(0, firstPrimaryIndex),
    ...rows.slice(firstPrimaryIndex + 1)
  ];
};

const validateMatchRowsWithPrimaryCheck = (
  rows?: MatchRow[],
  isPrimaryType: (type?: string) => boolean = isPrimaryBlacklistMatchType
) => {
  if (!rows?.length) {
    return 'empty' as const;
  }
  const normalizedRows = normalizeMatchRowsOrder(rows, isPrimaryType);
  const hasPrimaryType = normalizedRows.some((row) =>
    isPrimaryType(row.type as string)
  );
  if (!hasPrimaryType) {
    return 'missingPrimaryType' as const;
  }
  const seen = new Set<string>();
  for (const row of normalizedRows) {
    if (!row.type || !row.content?.trim()) {
      return 'incomplete' as const;
    }
    const key = `${row.type}:${row.content.trim()}`;
    if (seen.has(key)) {
      return 'duplicate' as const;
    }
    seen.add(key);
  }
  return null;
};

export const validateMatchRows = (rows?: MatchRow[]) =>
  validateMatchRowsWithPrimaryCheck(rows, isPrimaryBlacklistMatchType);

export const validateAuditWhitelistMatchRows = (rows?: MatchRow[]) => {
  if (!rows?.length) {
    return 'empty' as const;
  }
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row.type || !row.content?.trim()) {
      return 'incomplete' as const;
    }
    const key = `${row.type}:${row.content.trim()}`;
    if (seen.has(key)) {
      return 'duplicate' as const;
    }
    seen.add(key);
  }
  return null;
};
