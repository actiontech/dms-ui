export type DownloadRecordProps = {
  noDuplicate: boolean;
  taskId: string;
  /** UI 筛选态（含 error_P0 / error_P1）；与列表共用 deriveAuditLevelFilterParams */
  auditLevelFilterValue?: string;
};
