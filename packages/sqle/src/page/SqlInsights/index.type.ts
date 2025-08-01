import { Dayjs } from 'dayjs';
import { DateRangeEnum } from './index.data';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';

export interface SqlInsightsChartProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  timePeriod: DateRangeEnum;
  pollingInterval?: number;
  onCreateSqlManagementConf: (
    metricName: GetSqlPerformanceInsightsMetricNameEnum
  ) => void;
}
