import { ListDataExportWorkflowsFilterByStatusEnum } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.enum';
import { t } from '../../../locale';

export const DataExportStatusDictionary: Record<
  keyof typeof ListDataExportWorkflowsFilterByStatusEnum,
  string
> = {
  [ListDataExportWorkflowsFilterByStatusEnum.wait_for_approve]: t(
    'dmsDataExport.status.wait_for_audit'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.finish]: t(
    'dmsDataExport.status.finished'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.cancel]: t(
    'dmsDataExport.status.canceled'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.wait_for_export]: t(
    'dmsDataExport.status.wait_for_export'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.rejected]: t(
    'dmsDataExport.status.rejected'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.exporting]: t(
    'dmsDataExport.status.exporting'
  ),
  [ListDataExportWorkflowsFilterByStatusEnum.failed]: t(
    'dmsDataExport.status.export_failed'
  )
};
