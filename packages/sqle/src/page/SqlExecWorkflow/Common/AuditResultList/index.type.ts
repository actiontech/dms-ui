import {
  IAuditTaskResV1,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceTipResV1SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlCount: number) => void;
  updateTaskAuditRuleExceptionStatus?: (taskSqls: IAuditTaskSQLResV2[]) => void;
  showTaskTab?: boolean;
  allowSwitchBackupPolicy?: boolean;
  onBatchSwitchBackupPolicy?: (
    currentTaskID?: string,
    supportedBackupStrategy?: InstanceTipResV1SupportedBackupStrategyEnum[]
  ) => void;
  tasksSupportedBackupPolicies?: {
    [key: number]: InstanceTipResV1SupportedBackupStrategyEnum[] | undefined;
  };
};
