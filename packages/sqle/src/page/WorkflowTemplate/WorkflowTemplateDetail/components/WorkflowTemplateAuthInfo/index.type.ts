import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export interface WorkflowTemplateAuthInfoProps {
  level:
    | WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum
    | undefined;
  time?: string;
}
