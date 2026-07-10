import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { SqlAuditRuleExceptionSourceContext } from '../../../../RuleException/index.data';

export type AuditResultTableProps = {
  noDuplicate: boolean;
  taskID?: string;
  auditLevelFilterValue?: getAuditTaskSQLsV2FilterAuditLevelEnum;
  projectID: string;
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  dbType?: string;
  ruleExceptionSourceContext?: SqlAuditRuleExceptionSourceContext;
};

export type AuditResultDrawerProps = {
  open: boolean;
  onClose: () => void;
  auditResultRecord?: IAuditTaskSQLResV2;
  dbType?: string;
  clickAnalyze: (sqlNum?: number) => void;
  ruleExceptionSourceContext?: SqlAuditRuleExceptionSourceContext;
};
