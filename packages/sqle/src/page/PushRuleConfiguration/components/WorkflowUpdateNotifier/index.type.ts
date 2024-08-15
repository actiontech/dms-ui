import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type WorkflowUpdateNotifierProps = {
  config?: IReportPushConfigList;
  permission: boolean;
  refetch: () => void;
};

export type WorkflowUpdateNotifierFields = {
  enabled: boolean;
  triggerType: ReportPushConfigListTriggerTypeEnum;
  pushUserType: ReportPushConfigListPushUserTypeEnum;
};
