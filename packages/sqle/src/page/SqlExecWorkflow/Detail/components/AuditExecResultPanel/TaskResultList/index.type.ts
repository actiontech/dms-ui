import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { GetAuditTaskSQLsPrams } from '../index.type';
import { TaskResultListLayoutEnum } from '../index.enum';

export type TasksResultListBaseProps = {
  taskId: string;
  currentListLayout: TaskResultListLayoutEnum;
  auditResultActiveKey: string;
  noDuplicate: boolean;
  tableFilterInfo: GetAuditTaskSQLsPrams;
  execStatusFilterValue?: getAuditTaskSQLsV2FilterExecStatusEnum;
  workflowStatus?: WorkflowRecordResV2StatusEnum;
  assigneeUserNames: string[];
  executeMode: WorkflowResV2ExecModeEnum;
  backupConflict?: boolean;
};
