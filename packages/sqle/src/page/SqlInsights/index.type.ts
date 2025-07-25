import { Dayjs } from 'dayjs';
import { DateRangeEnum } from './index.data';

export interface SqlInsightsChartProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  timePeriod: DateRangeEnum;
  pollingInterval?: number;
  onCreateSqlManagementConf?: () => void;
}
