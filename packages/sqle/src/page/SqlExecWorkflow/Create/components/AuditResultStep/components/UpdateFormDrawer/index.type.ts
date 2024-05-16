import {
  SharedStepDetails,
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../../../index.type';
import { SqlAuditInfoFormProps } from '../../../FormStep/SqlAuditInfoForm/index.type';

export type UpdateFormDrawerProps = {
  open: boolean;
  onClose: () => void;
  baseFormValues?: WorkflowBaseInfoFormFields;
  sqlAuditInfoFormValues?: SqlAuditInfoFormFields;
} & Omit<SqlAuditInfoFormProps, 'form'> &
  SharedStepDetails;
