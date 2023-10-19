import {
  IWorkflowRecordResV2,
  IWorkflowResV2,
  IWorkflowStepResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TasksStatusNumberType } from '../index.type';

export type OrderRecordInfoProps = {
  open: boolean;
  close: () => void;
  orderInfo?: IWorkflowResV2;
  tasksStatusNumber?: TasksStatusNumberType;
};

export type OrderBasicInfoProps = {
  createUserName: string;
  createTime: string;
  orderStatus?: WorkflowRecordResV2StatusEnum;
};

export type OrderStepsProps = {
  workflowSteps?: IWorkflowStepResV2[];
  currentStepNumber?: number;
  orderStatus?: WorkflowRecordResV2StatusEnum;
  tasksStatusNumber?: TasksStatusNumberType;
};

export type OrderHistoryStepsProps = {
  recordHistoryList?: IWorkflowRecordResV2[];
};
