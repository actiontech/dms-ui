import {
  IWorkflowRecordResV2,
  IWorkflowResV2,
  IWorkflowStepResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TasksStatusCount } from '../../index.type';

export type WorkflowRecordInfoProps = {
  onClose: () => void;
  visibility: boolean;
  workflowInfo?: IWorkflowResV2;
  tasksStatusCount?: TasksStatusCount;
};

export type WorkflowBasicInfoProps = {
  createUserName: string;
  createTime: string;
  workflowStatus?: WorkflowRecordResV2StatusEnum;
};

export type WorkflowStepsProps = {
  workflowSteps?: IWorkflowStepResV2[];
  currentStepNumber?: number;
  workflowStatus?: WorkflowRecordResV2StatusEnum;
  tasksStatusCount?: TasksStatusCount;
};

export type WorkflowHistoryStepsProps = {
  recordHistoryList?: IWorkflowRecordResV2[];
};
