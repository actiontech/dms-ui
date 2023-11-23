import { FormInstance } from 'antd';
import { UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type SubscribeNoticeFormFields = {
  interval: number;
  level: UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum;
  emailEnable: boolean;
  webhooksEnable: boolean;
  webhooksUrl: string;
  template: string;
};

export interface ISubscribeNoticeForm {
  form: FormInstance<SubscribeNoticeFormFields>;
}
