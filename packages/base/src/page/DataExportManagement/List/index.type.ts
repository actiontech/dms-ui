import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';

export interface IListDataExportWorkflowWithExtraParams
  extends IListDataExportWorkflow {
  db_service_uid?: string;
}
