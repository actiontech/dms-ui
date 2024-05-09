import {
  IAuditTaskSQLResV2,
  IFileOverview
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

type BaseProps = {
  projectName: string;
  taskId: string;
};

export type SQLExecuteResultCardProps = BaseProps &
  IAuditTaskSQLResV2 & {
    onUpdateDescription?: () => void;
  };

export type FileExecuteResultCardProps = BaseProps &
  IFileOverview & {
    orderStatus?: WorkflowRecordResV2StatusEnum;
  };

export type ResultCardProps =
  | (SQLExecuteResultCardProps & {
      executeMode: WorkflowResV2ExecModeEnum.sqls;
    })
  | (FileExecuteResultCardProps & {
      executeMode: WorkflowResV2ExecModeEnum.sql_file;
    });
