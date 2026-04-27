import {
  IUserTipResV1,
  IWorkFlowStepTemplateResV1
} from '@actiontech/shared/lib/api/sqle/service/common';

export interface IWorkflowTemplateStepInfoProps {
  reviewStepData: IWorkFlowStepTemplateResV1[];
  execStepData: IWorkFlowStepTemplateResV1;
  usernameList: IUserTipResV1[];
}
