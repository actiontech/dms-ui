import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';

export interface IListDataExportWorkflowWithExtraParams
  extends IListDataExportWorkflow {
  db_service_uid?: string;
  /** 列表 API 可能无此字段；由二次拉取任务回填（FE-S3-03） */
  export_file_type?: string;
}
