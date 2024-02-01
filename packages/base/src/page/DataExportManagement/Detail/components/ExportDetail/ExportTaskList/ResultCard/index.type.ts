import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';

export type ExportResultCardProp = IListDataExportTaskSQL & {
  taskID: string;
};
