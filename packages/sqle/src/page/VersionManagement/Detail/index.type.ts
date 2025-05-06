import {
  IInstanceTipResV2,
  IWorkflowDetailWithInstance
} from '@actiontech/shared/lib/api/sqle/service/common';
import { SelectProps } from 'antd';
import { SqlVersionDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type TargetReleaseInstanceType = {
  instance_id?: string;

  instance_schema?: string;

  target_instance_id?: string;

  target_instance_name?: string;

  target_instance_schema?: string;
};

export type TargetReleaseWorkflowType = {
  target_release_instances?: Array<TargetReleaseInstanceType>;

  workflow_id?: string;
};

export type ReleaseWorkflowFormType = {
  release_workflows: Array<TargetReleaseWorkflowType>;
};

export type DataSourceFieldProps = {
  fieldNamePath: (string | number)[];
  instanceTipsLoading: boolean;
  instanceList: IInstanceTipResV2[];
  instanceOptions: SelectProps['options'];
  instanceIDOptions: SelectProps['options'];
};

export type StageNodeData = {
  versionStatus?: SqlVersionDetailResV1StatusEnum;
  workflowList?: IWorkflowDetailWithInstance[];
  label?: string;
  stageId: number;
  isFirstStage?: boolean;
  isLastStage?: boolean;
  onRetry?: (workflowId: string) => void;
  onOfflineExecute?: (workflowId: string) => void;
  onAssociateWorkflow?: (stageId: number) => void;
  onCreateNewWorkflow?: () => void;
  onExecute?: () => void;
  allowExecute?: boolean;
  showReleaseButton?: boolean;
};

export type CustomEdgeData = {
  onRelease?: () => void;
  allowRelease?: boolean;
  onExecute?: () => void;
  sourceWorkflowList?: any[];
};
