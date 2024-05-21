import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  SqlAuditInfoFormFields,
  CreateWorkflowDatabaseInfo
} from '../../../Create/index.type';

export type ModifySqlStatementProps = {
  backToDetail: () => void;
  isAtRejectStep: boolean;
  auditAction: (
    values: SqlAuditInfoFormFields,
    databaseInfo: CreateWorkflowDatabaseInfo
  ) => Promise<void>;
  currentTasks?: IAuditTaskResV1[];
  isSameSqlForAll: boolean;
  modifiedTasks?: IAuditTaskResV1[];
  isDisableFinallySubmitButton: boolean;
  disabledOperatorOrderBtnTips: string;
  workflowId: string;
  refreshWorkflow: () => void;
  refreshOverviewAction: () => void;
  executeMode?: WorkflowResV2ExecModeEnum;
  auditExecPanelTabChangeEvent: (key: string) => void;
};
