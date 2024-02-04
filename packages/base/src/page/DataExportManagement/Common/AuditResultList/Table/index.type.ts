import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';

export type AuditResultTableProps = {
  taskID?: string;
  projectID: string;
  updateExecuteSQLsTypeIsDQL?: (val: boolean) => void;
};

export type AuditResultDrawerProps = {
  open: boolean;
  onClose: () => void;
  auditResultRecord?: IListDataExportTaskSQL;
};
