import {
  IAuditTaskResV1,
  IAuditTaskSQLResV2
} from '@actiontech/shared/lib/api/sqle/service/common';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlCount: number) => void;
  updateTaskAuditRuleExceptionStatus?: (taskSqls: IAuditTaskSQLResV2[]) => void;
  showTaskTab?: boolean;
};
