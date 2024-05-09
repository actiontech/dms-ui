import {
  IAuditTaskSQLResV2,
  IAuditFileStatistic
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

type BaseProps = {
  taskId: string;
};

export type SQLExecuteResultCardProps = BaseProps &
  IAuditTaskSQLResV2 & {
    onUpdateDescription?: () => void;
    projectName: string;
  };

export type FileExecuteResultCardProps = BaseProps &
  IAuditFileStatistic & {
    projectID: string;
  };

export type ResultCardProps =
  | (SQLExecuteResultCardProps & {
      executeMode: WorkflowResV2ExecModeEnum.sqls;
    })
  | (FileExecuteResultCardProps & {
      executeMode: WorkflowResV2ExecModeEnum.sql_file;
    });
