import { useRequest } from 'ahooks';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { useEffect } from 'react';
import { DateRangeEnum } from '../index.data';
import useDateRange from './useDateRange';

interface UseSqlInsightsMetricProps {
  instanceId?: string;
  dateRange?: [Dayjs, Dayjs];
  metricName: GetSqlPerformanceInsightsMetricNameEnum;
  pollingInterval?: number;
  timePeriod: DateRangeEnum;
}

export const useSqlInsightsMetric = ({
  instanceId,
  dateRange,
  metricName,
  pollingInterval,
  timePeriod
}: UseSqlInsightsMetricProps) => {
  const { projectName } = useCurrentProject();
  const { getDataRange } = useDateRange();
  const { selectedChartStartTime, selectedChartEndTime } = useSelector(
    (state: IReduxState) => {
      const { selectedDateRange } = state.sqlInsights.relateSqlList;
      return {
        selectedChartStartTime:
          selectedDateRange?.[0].format('YYYY-MM-DD HH:mm:ss') ?? '',
        selectedChartEndTime:
          selectedDateRange?.[1].format('YYYY-MM-DD HH:mm:ss') ?? ''
      };
    }
  );

  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    data,
    loading,
    runAsync: getChartData,
    cancel
  } = useRequest(
    () => {
      let startTime: Dayjs | undefined;
      let endTime: Dayjs | undefined;
      if (timePeriod !== DateRangeEnum['custom']) {
        [startTime, endTime] = getDataRange(timePeriod);
      } else {
        [startTime, endTime] = dateRange ?? [];
      }

      return SqleApi.SqlInsightService.GetSqlPerformanceInsights({
        project_name: projectName,
        instance_id: instanceId ?? '',
        metric_name: metricName,
        start_time: startTime?.format('YYYY-MM-DD HH:mm:ss') ?? '',
        end_time: endTime?.format('YYYY-MM-DD HH:mm:ss') ?? ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setErrorMessage('');

          // 处理返回的数据，添加边界数据点
          const processedData = { ...res.data.data };
          if (processedData?.lines && startTime && endTime) {
            const startTimeStr = startTime.format('YYYY-MM-DD HH:mm:ss');
            const endTimeStr = endTime.format('YYYY-MM-DD HH:mm:ss');

            processedData.lines = processedData.lines.map((line: any) => {
              if (
                !line.points ||
                !Array.isArray(line.points) ||
                line.points.length === 0
              ) {
                return line;
              }

              const points = [...line.points];

              // 检查第一个点的时间是否大于 startTime
              if (points[0]?.x && dayjs(points[0].x).isAfter(startTime)) {
                points.unshift({ x: startTimeStr });
              }

              // 检查最后一个点的时间是否小于 endTime
              const lastPoint = points[points.length - 1];
              if (lastPoint?.x && dayjs(lastPoint.x).isBefore(endTime)) {
                points.push({ x: endTimeStr });
              }

              return {
                ...line,
                points
              };
            });
          }

          return processedData;
        } else {
          setErrorMessage(res.data.message);
          cancel();
        }
      });
    },
    {
      refreshDeps: [projectName, instanceId, dateRange, metricName, timePeriod],
      pollingInterval: pollingInterval,
      onError: () => {
        cancel();
      },
      onSuccess: (res) => {
        if (!res?.task_support) {
          cancel();
        }
      },
      ready: !!(projectName && instanceId && metricName)
    }
  );

  useEffect(() => {
    if (selectedChartStartTime && selectedChartEndTime) {
      cancel();
    }
  }, [selectedChartStartTime, selectedChartEndTime, cancel]);

  return {
    loading,
    chartData: data?.lines ?? [],
    getChartData,
    isTaskEnabled: data?.task_enable ?? true,
    isTaskSupported: data?.task_support ?? true,
    errorMessage
  };
};

export default useSqlInsightsMetric;
