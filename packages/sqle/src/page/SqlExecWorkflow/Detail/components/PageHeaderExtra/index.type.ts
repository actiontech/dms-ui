import {
  IMaintenanceTimeResV1,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';

export type MaintenanceTimeInfoType = Array<{
  instanceName: string;
  maintenanceTime: IMaintenanceTimeResV1[];
}>;

export type WorkflowDetailPageHeaderExtraProps = {
  workflowInfo?: IWorkflowResV2;
  refreshWorkflow: () => void;
  passAction: (stepId: number) => Promise<void>;
  rejectAction: (reason: string, stepId: number) => Promise<void>;
  executingAction: () => Promise<void>;
  completeAction: () => Promise<void>;
  terminateAction: () => Promise<void>;
  maintenanceTimeInfo?: MaintenanceTimeInfoType;
  canRejectWorkflow?: boolean;
  showWorkflowSteps: () => void;
  workflowStepsVisibility: boolean;
  executeInOtherInstanceAction: () => Promise<void>;
};

export type WorkflowDetailActionMeta = {
  action: (val?: string) => Promise<void> | undefined;
  loading: boolean;
  hidden: boolean;
};
