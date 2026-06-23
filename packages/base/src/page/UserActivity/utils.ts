import dayjs, { Dayjs } from 'dayjs';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

export const DATE_FORMAT = 'YYYY-MM-DD';

export const getDefaultStatDate = () => dayjs().subtract(1, 'day');

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

export const formatHourLabel = (hour?: number) => {
  if (hour === undefined || hour === null) {
    return '';
  }
  return `${String(hour).padStart(2, '0')}:00`;
};
