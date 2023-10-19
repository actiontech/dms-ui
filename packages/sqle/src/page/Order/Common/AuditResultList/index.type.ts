import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  projectID: string;
  updateTaskRecordTotalNum?: (taskId: string, sqlNumber: number) => void;
};
