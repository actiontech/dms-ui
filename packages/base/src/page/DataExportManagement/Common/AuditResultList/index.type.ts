import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';

export type AuditResultListProps = {
  taskIDs: string[];
  projectID: string;
  onSuccessGetDataExportTaskSqls?: (taskSqls: IListDataExportTaskSQL[]) => void;
  onErrorGetDataExportTaskSqls?: () => void;
};
