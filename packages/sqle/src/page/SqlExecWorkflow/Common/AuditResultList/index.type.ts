import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlAuditRuleExceptionSourceContext } from '../../../RuleException/index.data';

export type AuditResultListProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  showTaskTab?: boolean;
  ruleExceptionSourceContext?: SqlAuditRuleExceptionSourceContext;
};
