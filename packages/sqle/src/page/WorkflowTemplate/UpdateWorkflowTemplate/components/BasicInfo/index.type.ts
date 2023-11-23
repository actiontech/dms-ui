import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormInstance } from 'antd';

export type BaseFormProps = {
  form: FormInstance<BaseFormFields>;
  defaultData?: IWorkflowTemplateDetailResV1;
  nextStep: () => void;
  updateBaseInfo: (
    info: BaseFormFields['allowSubmitWhenLessAuditLevel']
  ) => void;
  totalStep: number;
};

export type BaseFormFields = {
  allowSubmitWhenLessAuditLevel?: WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum;
};
