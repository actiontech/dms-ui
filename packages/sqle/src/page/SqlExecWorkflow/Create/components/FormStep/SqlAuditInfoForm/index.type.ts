import { SharedStepDetails } from '../../../index.type';
import { CreateWorkflowFormStepProps } from '../index.type';

export type SqlAuditInfoFormProps = {
  handleInstanceNameChange?: (name: string) => void;
} & SharedStepDetails &
  Pick<CreateWorkflowFormStepProps, 'auditAction'>;

export type SqlAuditInfoFormItemProps = SqlAuditInfoFormProps;

export type DatabaseSelectionItemProps = Omit<
  SqlAuditInfoFormProps,
  'auditAction' | ''
>;
