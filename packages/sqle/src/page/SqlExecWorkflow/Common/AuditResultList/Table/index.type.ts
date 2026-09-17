import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlAuditRuleExceptionSourceContext } from '../../../../RuleException/index.data';
import { AuditLevelFilterUIValue } from '../../auditLevelFilter';

export type AuditResultTableProps = {
  noDuplicate: boolean;
  taskID?: string;
  auditLevelFilterValue?: AuditLevelFilterUIValue;
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
