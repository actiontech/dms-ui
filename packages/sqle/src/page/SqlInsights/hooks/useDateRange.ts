import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useState } from 'react';
import { AutoRefreshIntervalEnum, DateRangeEnum } from '../index.data';

const useDateRange = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(24, 'hour'),
    dayjs()
  ]);

  const [timePeriod, setTimePeriod] = useState<DateRangeEnum>(
    DateRangeEnum['24H']
  );

  const [autoRefreshInterval, setAutoRefreshInterval] =
    useState<AutoRefreshIntervalEnum>(AutoRefreshIntervalEnum['1m']);

  const getDataRange = useCallback((value: DateRangeEnum) => {
    let startTime = dayjs();
    const endTime = dayjs();

    if (value === DateRangeEnum['24H']) {
      startTime = endTime.subtract(24, 'hour');
    } else if (value === DateRangeEnum['7D']) {
      startTime = endTime.subtract(7, 'day');
    } else if (value === DateRangeEnum['30D']) {
      startTime = endTime.subtract(30, 'day');
    }

    return [startTime, endTime];
  }, []);

  return {
    dateRange,
    setDateRange,
    timePeriod,
    setTimePeriod,
    autoRefreshInterval,
    setAutoRefreshInterval,
    getDataRange
  };
};

export default useDateRange;
