import { IMaintenanceTimeResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type TasksStatusCount = {
  success: number;
  failed: number;
  executing: number;
};

export type MaintenanceTimeInfo = Array<{
  instanceName: string;
  maintenanceTime: IMaintenanceTimeResV1[];
}>;
