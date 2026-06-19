import {
  IAuditTaskResV1,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { InstanceTipResV2SupportedBackupStrategyEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  showTaskTab?: boolean;
  allowSwitchBackupPolicy?: boolean;
  onBatchSwitchBackupPolicy?: (
    currentTaskID?: string,
    supportedBackupStrategy?: InstanceTipResV2SupportedBackupStrategyEnum[]
  ) => void;
  tasksSupportedBackupPolicies?: Record<
    string,
    InstanceTipResV2SupportedBackupStrategyEnum[] | undefined
  >;
  updateTaskAuditRuleExceptionStatus?: (taskSqls: IAuditTaskSQLResV2[]) => void;
  onRuleExceptionCreated?: () => void;
};
