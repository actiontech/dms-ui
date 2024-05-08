import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { ListLayoutEnum } from '../../Common/ListLayoutSelector/index.types';
import { GetAuditTaskPrams } from '../index.type';

export type TasksResultListBaseProps = {
  taskId: string;
  currentListLayout: ListLayoutEnum;
  auditResultActiveKey: string;
  duplicate: boolean;
  tableFilterInfo: GetAuditTaskPrams;
  auditLevelFilterValue: getAuditTaskSQLsV2FilterExecStatusEnum | 'all';
  orderStatus?: WorkflowRecordResV2StatusEnum;
  executeMode: WorkflowResV2ExecModeEnum;
};
