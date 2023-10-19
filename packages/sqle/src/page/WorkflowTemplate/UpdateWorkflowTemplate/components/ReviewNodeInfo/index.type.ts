import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { FormInstance } from 'antd5';

export enum NodeTypeEnum {
  review = 'review',
  exec = 'exec'
}

export enum ReviewAndExecUserTypeEnum {
  specify = 'specify',
  matchAuth = 'matchAuth'
}

export interface ReviewNodeField {
  approved_by_authorized?: boolean;
  assignee_user_id_list?: string[];
  desc?: string;
  execute_by_authorized?: boolean;
}

export type ReviewAndExecNodeInfoProps = {
  form: FormInstance<ReviewNodeField>;
  type: NodeTypeEnum;
  defaultData?: IWorkFlowStepTemplateResV1;
  prevStep?: () => void;
  nextStep?: () => void;
  currentStep: number;
  totalStep: number;
  updateReviewAndExecNodeInfo: (data: IWorkFlowStepTemplateResV1) => void;
  generateUsernameSelectOption: () => React.ReactNode;
};
