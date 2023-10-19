import { IMaintenanceTimeResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type ScheduleTimeModalProps = {
  open: boolean;
  submit: (scheduleTime?: string | undefined) => Promise<void>;
  closeScheduleModal: () => void;
  maintenanceTime?: IMaintenanceTimeResV1[];
};
