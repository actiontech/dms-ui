import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ReportPushConfigListPushUserTypeEnum,
  ReportPushConfigListTriggerTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const reportPushConfigMockData: IReportPushConfigList[] = [
  {
    report_push_config_id: '1',
    type: 'workflow',
    enabled: true,
    trigger_type: ReportPushConfigListTriggerTypeEnum.immediately,
    push_frequency_cron: '',
    push_user_Type: ReportPushConfigListPushUserTypeEnum.permission_match,
    push_user_list: [],
    last_push_time: '0001-01-01T00:00:00Z'
  },
  {
    report_push_config_id: '2',
    type: 'sql_manage',
    enabled: false,
    trigger_type: ReportPushConfigListTriggerTypeEnum.timing,
    push_frequency_cron: '* * * * *',
    push_user_Type: ReportPushConfigListPushUserTypeEnum.fixed,
    push_user_list: ['1821379466824257536', '1826816885652459520'],
    last_push_time: '0001-01-01T00:00:00Z'
  }
];
