import { Dayjs } from 'dayjs';

export interface SqlInsightsChartProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  pollingInterval?: number;
}
