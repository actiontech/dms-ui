import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  showTaskTab?: boolean;
  allowSwitchBackupPolicy?: boolean;
  onBatchSwitchBackupPolicy?: (currentTaskID?: string) => void;
};
