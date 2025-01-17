import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  SqlAuditInfoFormFields,
  CreateWorkflowDatabaseInfo
} from '../../../Create/index.type';
import React from 'react';
import { SubmitWorkflowButtonProps } from '../../../Common/SubmitWorkflowButton/index.type';

export interface ModifySqlStatementProps
  extends Pick<
    SubmitWorkflowButtonProps,
    'submitWorkflowConfirmationMessage' | 'isConfirmationRequiredForSubmission'
  > {
  backToDetail: () => void;
  backToDetailText?: React.ReactNode;
  isAtRejectStep: boolean;
  auditAction: (
    values: SqlAuditInfoFormFields,
    databaseInfo: CreateWorkflowDatabaseInfo
  ) => Promise<void>;
  currentTasks?: IAuditTaskResV1[];
  isSameSqlForAll: boolean;
  modifiedTasks?: IAuditTaskResV1[];
  workflowId: string;
  refreshWorkflow?: () => void;
  refreshOverviewAction?: () => void;
  executeMode?: WorkflowResV2ExecModeEnum;
  auditExecPanelTabChangeEvent?: (key: string) => void;
}
