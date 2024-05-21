import { FormInstance } from 'antd';
import {
  SharedStepDetails,
  SqlAuditInfoFormFields,
  WorkflowBaseInfoFormFields
} from '../../index.type';

export type CreateWorkflowFormStepProps = {
  baseInfoForm: FormInstance<WorkflowBaseInfoFormFields>;
  sqlAuditInfoForm: FormInstance<SqlAuditInfoFormFields>;
  auditAction: (
    value: SqlAuditInfoFormFields,
    baseInfo?: WorkflowBaseInfoFormFields
  ) => Promise<void>;
} & SharedStepDetails;
