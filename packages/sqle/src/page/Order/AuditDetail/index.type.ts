import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IGetAuditTaskSQLsV2Params } from '@actiontech/shared/lib/api/sqle/service/task/index.d';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { TablePagination } from '@actiontech/shared/lib/components/ActiontechTable';
import { TableProps } from 'antd5';

export type OrderDetailAuditResultProps = {
  taskInfos?: IAuditTaskResV1[];
  orderInfo?: IWorkflowResV2;
  projectName: string;
  isArchive?: boolean;
  refreshOverviewFlag?: boolean;
  refreshOrder?: () => void;
  orderStatus?: WorkflowRecordResV2StatusEnum;
  getOverviewListSuccessHandle?: (list: IGetWorkflowTasksItemV2[]) => void;
  mode?: 'order' | 'auditRecordCreate' | 'auditRecordDetail';
  taskId?: string;
};

// page_size and page_index type is  string
export type GetAuditTaskPrams = Pick<
  IGetAuditTaskSQLsV2Params,
  'filter_audit_level'
>;

export type AuditResultExecStatusFilterType =
  | getAuditTaskSQLsV2FilterExecStatusEnum
  | 'all';

export type DataSourceResultListProps = {
  list: IAuditTaskSQLResV2[] | undefined;
  total: number | undefined;
  pagination: TablePagination;
  onChange: TableProps<IAuditTaskSQLResV2>['onChange'];
  loading: boolean;
  taskId: string;
  refresh: () => void;
};

export type DataSourceResultWaterfallListProps = {
  list: IAuditTaskSQLResV2[] | undefined;
  hasMore: boolean;
  next?: () => void;
  loading: boolean;
  taskId: string;
  scrollPage: number;
  refreshScrollList: (number: number, page: number) => void;
};
