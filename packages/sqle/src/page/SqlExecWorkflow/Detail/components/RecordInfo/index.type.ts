import {
  IWorkflowRecordResV2,
  IWorkflowResV2,
  IWorkflowStepResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { TasksStatusCount } from '../../index.type';
import {
  IAssociatedStageWorkflows,
  IAssociatedRollbackWorkflow
} from '@actiontech/shared/lib/api/sqle/service/common.d';

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
  /** 只读展示；无值时页面显示「-」 */
  opsTypeName?: string;
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

export type AssociatedVersionStageWorkflowsProps = {
  associatedWorkflows?: IAssociatedStageWorkflows[];
  workflowId?: string;
};

export type AssociatedRollbackWorkflowsProps = {
  associatedWorkflows?: IAssociatedRollbackWorkflow[];
};
