import { IMaintenanceTimeResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Dayjs } from 'dayjs';

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

export type ScheduleTimeFormFields = {
  schedule_time: Dayjs;
  notification_confirmation: boolean;
  confirmation_method: UpdateWorkflowScheduleReqV2NotifyTypeEnum;
};
