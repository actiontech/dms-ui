import { IMaintenanceTimeResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type ScheduleTimeModalProps = {
  open: boolean;
  submit: (
    scheduleTime?: string,
    isNotify?: boolean,
    notifyType?: UpdateWorkflowScheduleReqV2NotifyTypeEnum
  ) => Promise<void>;
  closeScheduleModal: () => void;
  maintenanceTime?: IMaintenanceTimeResV1[];
};
