import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IUserTipResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export interface IDataExportStepInfoProps {
  currentStep?: number;
  reviewStepData: IWorkFlowStepTemplateResV1[];
  execStepData?: IWorkFlowStepTemplateResV1;
  hasExecStep: boolean;
  addReviewNode: () => void;
  removeReviewNode: () => void;
  addExecNode: () => void;
  removeExecNode: () => void;
  exchangeReviewNode: (from: number, to: number) => void;
  clickReviewNode: (index: number) => void;
  usernameList: IUserTipResV1[];
}
