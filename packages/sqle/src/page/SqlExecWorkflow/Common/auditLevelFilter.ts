/**
 * S3 §8.2 — UI 筛选态 → 列表/导出共用请求参数。
 * 禁止把 P0/P1 写入 filter_audit_level。
 */

import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

export const AUDIT_LEVEL_FILTER_UI = {
  normal: 'normal',
  notice: 'notice',
  warn: 'warn',
  error_P0: 'error_P0',
  error_P1: 'error_P1'
} as const;

export type AuditLevelFilterUIValue =
  | (typeof AUDIT_LEVEL_FILTER_UI)[keyof typeof AUDIT_LEVEL_FILTER_UI]
  | undefined;

/** Segmented 六项（不含「全部」；全部由 withAll 提供） */
export const AUDIT_LEVEL_FILTER_SEGMENT_OPTIONS: Exclude<
  AuditLevelFilterUIValue,
  undefined
>[] = [
  AUDIT_LEVEL_FILTER_UI.normal,
  AUDIT_LEVEL_FILTER_UI.notice,
  AUDIT_LEVEL_FILTER_UI.warn,
  AUDIT_LEVEL_FILTER_UI.error_P0,
  AUDIT_LEVEL_FILTER_UI.error_P1
];

export type AuditLevelFilterRequestParams = {
  filter_audit_level?: getAuditTaskSQLsV2FilterAuditLevelEnum;
  filter_error_priority?: 'P0' | 'P1';
};

/**
 * 从结果页/高级筛选 UI 值派生 query。
 * - error_P0 / error_P1 → level=error + priority
 * - normal|notice|warn|error → 仅 level（兼容遗留「仅错误」）
 * - undefined / all / 空 → 两参数均省略
 */
export const deriveAuditLevelFilterParams = (
  uiValue?: string | null
): AuditLevelFilterRequestParams => {
  if (!uiValue || uiValue === 'all') {
    return {};
  }
  if (uiValue === AUDIT_LEVEL_FILTER_UI.error_P0) {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.error,
      filter_error_priority: 'P0'
    };
  }
  if (uiValue === AUDIT_LEVEL_FILTER_UI.error_P1) {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.error,
      filter_error_priority: 'P1'
    };
  }
  if (uiValue === 'normal') {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    };
  }
  if (uiValue === 'notice') {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.notice
    };
  }
  if (uiValue === 'warn') {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.warn
    };
  }
  if (uiValue === 'error') {
    return {
      filter_audit_level: getAuditTaskSQLsV2FilterAuditLevelEnum.error
    };
  }
  return {};
};

/**
 * 将可能含 error_P0/error_P1 的 filter_audit_level 字段 remap 进请求对象。
 * 用于 SQL 管控等「单一 select → filter_audit_level」高级筛选。
 */
export const applyDerivedAuditLevelFilters = <
  T extends Record<string, unknown>
>(
  params: T
): T & AuditLevelFilterRequestParams => {
  const raw = params.filter_audit_level;
  if (typeof raw !== 'string') {
    return params;
  }
  const derived = deriveAuditLevelFilterParams(raw);
  const next = { ...params } as T & AuditLevelFilterRequestParams;
  if (derived.filter_audit_level) {
    next.filter_audit_level = derived.filter_audit_level;
  } else {
    delete (next as Record<string, unknown>).filter_audit_level;
  }
  if (derived.filter_error_priority) {
    next.filter_error_priority = derived.filter_error_priority;
  } else {
    delete (next as Record<string, unknown>).filter_error_priority;
  }
  return next;
};
