import dayjs, { Dayjs } from 'dayjs';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

export const DATE_FORMAT = 'YYYY-MM-DD';

/** 图表绘图区固定高度，避免横轴被父容器裁切 */
export const USER_ACTIVITY_CHART_HEIGHT = 300;

/** 图表底部留白，避免横轴标签被裁切 */
export const USER_ACTIVITY_CHART_PADDING: [number, number, number, number] = [
  16, 16, 64, 16
];

export const formatHourLabel = (hour?: number) => {
  if (hour === undefined || hour === null) {
    return '';
  }
  return `${String(hour).padStart(2, '0')}:00`;
};

export const USER_ACTIVITY_HOUR_LABELS = Array.from({ length: 24 }, (_, hour) =>
  formatHourLabel(hour)
);

export const getDefaultStatDate = () => dayjs();

export const getTrendDateRange = (statDate: Dayjs): [string, string] => {
  const end = statDate;
  const start = statDate.subtract(6, 'day');
  return [start.format(DATE_FORMAT), end.format(DATE_FORMAT)];
};

export const formatPeakHour = (hour?: number) => {
  if (hour === undefined || hour === null) {
    return '-';
  }
  const start = `${String(hour).padStart(2, '0')}:00`;
  const end = `${String((hour + 1) % 24).padStart(2, '0')}:00`;
  return `${start}-${end}`;
};

export const formatErrorRate = (rate?: number) => {
  if (rate === undefined || rate === null) {
    return '-';
  }
  return `${floatRound(rate * 100, 2)}%`;
};

export const formatAvgRequest = (value?: number) => {
  if (value === undefined || value === null) {
    return '-';
  }
  return floatRound(value, 2).toString();
};

export const formatCount = (value?: number) => {
  if (value === undefined || value === null) {
    return '-';
  }
  return formatParamsBySeparator(value);
};

export const buildFullHourlyChartData = (
  data?: Array<{ stat_hour?: number; request_count?: number }>
) => {
  const hourMap = new Map<number, number>();
  data?.forEach((item) => {
    if (item.stat_hour !== undefined && item.stat_hour !== null) {
      hourMap.set(item.stat_hour, item.request_count ?? 0);
    }
  });
  return Array.from({ length: 24 }, (_, hour) => ({
    hour_label: formatHourLabel(hour),
    request_count: hourMap.get(hour) ?? 0
  }));
};
