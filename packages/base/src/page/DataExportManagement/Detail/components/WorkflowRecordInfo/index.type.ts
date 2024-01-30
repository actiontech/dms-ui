import {
  IWorkflowRecord,
  IWorkflowStep
} from '@actiontech/shared/lib/api/base/service/common';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { ExportTaskStatusNumberType } from '../../../../../store/dataExport';

export type WorkflowBasicInfoProps = {
  createUserName: string;
  createTime: string;
  workflowStatus?: WorkflowRecordStatusEnum;
};

export type WorkflowStepsProps = {
  workflowSteps?: IWorkflowStep[];
  currentStepNumber?: number;
  workflowStatus?: WorkflowRecordStatusEnum;
  createUser?: string;
  createTime?: string;
  taskStatusNumber?: ExportTaskStatusNumberType | null;
};

export type WorkflowHistoryStepsProps = {
  recordHistoryList?: IWorkflowRecord[];
};
