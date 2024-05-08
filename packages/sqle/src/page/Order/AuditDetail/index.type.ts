import {
  IAuditTaskResV1,
  IGetWorkflowTasksItemV2,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IGetAuditTaskSQLsV2Params } from '@actiontech/shared/lib/api/sqle/service/task/index.d';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

export type OrderDetailAuditResultProps = {
  taskInfos: IAuditTaskResV1[];
  orderInfo?: IWorkflowResV2;
  projectName: string;
  isArchive: boolean;
  refreshOverviewFlag: boolean;
  refreshOrder: () => void;
  orderStatus?: WorkflowRecordResV2StatusEnum;
  getOverviewListSuccessHandle: (list: IGetWorkflowTasksItemV2[]) => void;
};

// page_size and page_index type is  string
export type GetAuditTaskPrams = Pick<
  IGetAuditTaskSQLsV2Params,
  'filter_audit_level'
>;

export type AuditResultExecStatusFilterType =
  | getAuditTaskSQLsV2FilterExecStatusEnum
  | 'all';
