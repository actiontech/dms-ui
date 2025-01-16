import {
  SharedStepDetails,
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../index.type';
import { SubmitWorkflowButtonProps } from '../../../Common/SubmitWorkflowButton/index.type';
import { AuditResultListProps } from '../../../Common/AuditResultList/index.type';

export interface AuditResultStepProps
  extends Pick<
      SubmitWorkflowButtonProps,
      | 'isConfirmationRequiredForSubmission'
      | 'submitWorkflowConfirmationMessage'
      | 'hasExceptionAuditRule'
    >,
    SharedStepDetails,
    Pick<
      AuditResultListProps,
      'updateTaskAuditRuleExceptionStatus' | 'updateTaskRecordCount' | 'tasks'
    > {
  baseFormValues?: WorkflowBaseInfoFormFields;
  sqlAuditInfoFormValues?: SqlAuditInfoFormFields;
  createAction: () => Promise<void>;
  auditAction: (
    value: SqlAuditInfoFormFields,
    baseInfo?: WorkflowBaseInfoFormFields
  ) => Promise<void>;
}
