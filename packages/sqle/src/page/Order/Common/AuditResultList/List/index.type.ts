import { AuditResultLevelFilterType } from '../../../Create/AuditResult/index.type';

export type AuditResultForCreateListProps = {
  duplicate: boolean;
  taskID?: string;
  auditLevelFilterValue: AuditResultLevelFilterType;
  projectID: string;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
  dbType?: string;
};
