import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormInstance } from 'antd';

export type BaseFormProps = {
  form: FormInstance<BaseFormFields>;
  defaultData?: IWorkflowTemplateDetailResV1;
  nextStep: () => void;
  updateBaseInfo: (info: BaseFormFields) => void;
  totalStep: number;
  isCreateMode?: boolean;
};

export type BaseFormFields = {
  workflowTemplateName?: string;
  desc?: string;
  allowSubmitWhenLessAuditLevel?: UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum;
};
