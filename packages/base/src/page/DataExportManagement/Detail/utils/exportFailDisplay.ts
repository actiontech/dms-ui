/**
 * 数据导出失败展示常量与解析（对齐 S1/S2/S3；wire 与后端一致，禁止另造）
 */

import type { I18nKey } from '../../../../locale';
import { ListDataExportTaskSQLExportStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const EXPORT_FAIL_STAGE = {
  task_schedule: 'task_schedule',
  connect: 'connect',
  prepare: 'prepare',
  sql_execute: 'sql_execute',
  file_generate: 'file_generate'
} as const;

export type ExportFailStage =
  (typeof EXPORT_FAIL_STAGE)[keyof typeof EXPORT_FAIL_STAGE];

export const exportFailStageI18nKey: Record<string, I18nKey> = {
  [EXPORT_FAIL_STAGE.task_schedule]: 'dmsDataExport.failStage.task_schedule',
  [EXPORT_FAIL_STAGE.connect]: 'dmsDataExport.failStage.connect',
  [EXPORT_FAIL_STAGE.prepare]: 'dmsDataExport.failStage.prepare',
  [EXPORT_FAIL_STAGE.sql_execute]: 'dmsDataExport.failStage.sql_execute',
  [EXPORT_FAIL_STAGE.file_generate]: 'dmsDataExport.failStage.file_generate'
};

export const resolveExportFailStageI18nKey = (
  stage?: string | null
): I18nKey | null => {
  const trimmed = stage?.trim() ?? '';
  if (!trimmed) {
    return null;
  }
  return exportFailStageI18nKey[trimmed] ?? 'dmsDataExport.failStage.unknown';
};

/** SQL 级执行状态（对齐 S3 §8.2 / §9.4；成败只认本字段） */
export const EXPORT_SQL_STATUS = ListDataExportTaskSQLExportStatusEnum;

export const exportSqlStatusI18nKey: Partial<
  Record<ListDataExportTaskSQLExportStatusEnum, I18nKey>
> = {
  [ListDataExportTaskSQLExportStatusEnum.success]:
    'dmsDataExport.execStatus.success',
  [ListDataExportTaskSQLExportStatusEnum.failed]:
    'dmsDataExport.execStatus.failed',
  [ListDataExportTaskSQLExportStatusEnum.not_executed]:
    'dmsDataExport.execStatus.not_executed'
};

export const resolveExportSqlStatusI18nKey = (
  status?: string | null
): I18nKey | null => {
  const trimmed = status?.trim() ?? '';
  if (!trimmed) {
    return null;
  }
  return (
    exportSqlStatusI18nKey[trimmed as ListDataExportTaskSQLExportStatusEnum] ??
    null
  );
};

/**
 * 解析「导出结果」区展示文案。
 * - 成败只看 export_status，禁止用 export_result==="ok" 判成败
 * - failed 且有业务错误 → 原样；空才兜底
 * - not_executed → 优先 API 文案，空则固定未执行说明（由调用方注入 i18n 默认值）
 */
export const resolveExportResultDisplayText = (params: {
  exportStatus?: string | null;
  exportResult?: string | null;
  failedFallback: string;
  notExecutedHint: string;
}): string => {
  const status = params.exportStatus?.trim() ?? '';
  const result = params.exportResult?.trim() ?? '';

  if (status === ListDataExportTaskSQLExportStatusEnum.failed) {
    return result || params.failedFallback;
  }
  if (status === ListDataExportTaskSQLExportStatusEnum.not_executed) {
    return result || params.notExecutedHint;
  }
  if (status === ListDataExportTaskSQLExportStatusEnum.success) {
    return result || '-';
  }
  return result || '-';
};
