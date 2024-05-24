import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  SharedStepDetails,
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../index.type';

export type AuditResultStepProps = {
  tasks: IAuditTaskResV1[];
  updateTaskRecordCount?: (taskId: string, sqlNumber: number) => void;
  baseFormValues?: WorkflowBaseInfoFormFields;
  sqlAuditInfoFormValues?: SqlAuditInfoFormFields;
  isDisableFinallySubmitButton: boolean;
  disabledOperatorWorkflowBtnTips: string;
  createAction: () => Promise<void>;
  auditAction: (
    value: SqlAuditInfoFormFields,
    baseInfo?: WorkflowBaseInfoFormFields
  ) => Promise<void>;
} & SharedStepDetails;
