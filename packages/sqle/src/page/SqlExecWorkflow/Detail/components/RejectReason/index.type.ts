import { IWorkflowStepResV2 } from '@actiontech/shared/lib/api/sqle/service/common';

export type RejectReasonProps = {
  stepInfo: IWorkflowStepResV2;
  currentUsername: string;
  showModifySqlStatementStep: () => void;
  createWorkflowUserName: string;
};
