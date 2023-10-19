import {
  IMaintenanceTimeResV1,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';

export type MaintenanceTimeInfoType = Array<{
  instanceName: string;
  maintenanceTime: IMaintenanceTimeResV1[];
}>;

export type OrderDetailPageHeaderExtraProps = {
  projectName: string;
  orderInfo?: IWorkflowResV2;
  refreshOrder: () => void;
  pass: (stepId: number) => Promise<void>;
  reject: (reason: string, stepId: number) => Promise<void>;
  executing: () => Promise<void>;
  complete: () => Promise<void>;
  terminate: () => Promise<void>;
  maintenanceTimeInfo?: MaintenanceTimeInfoType;
  canRejectOrder?: boolean;
  openOrderStep: () => void;
  orderStepVisibility: boolean;
  isArchive: boolean;
};

export type OrderDetailActionMeta = {
  action: (val?: string) => Promise<void> | undefined;
  loading: boolean;
  hidden: boolean;
};
