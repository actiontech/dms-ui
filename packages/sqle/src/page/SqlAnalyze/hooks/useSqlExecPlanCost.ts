import { useRequest } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';
import { translateTimeForRequest } from '@actiontech/shared/lib/utils/Common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { IChartPoint } from '@actiontech/shared/lib/api/sqle/service/common';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { DateRangeEnum } from '../SqlAnalyze/ExecPlanCostChart/index.data';

export type getSqlExecPlanCostDataSourceParams = {
  startTime?: Dayjs;
  endTime?: Dayjs;
  lastPointEnabled?: boolean;
  rangeType?: DateRangeEnum;
};

const useSqlExecPlanCost = (id: string) => {
  const { projectName } = useCurrentProject();

  const [memoriedData, setMemoriedData] = useState<{
    [key in DateRangeEnum]: IChartPoint[] | undefined;
  }>({
    [DateRangeEnum['24H']]: undefined,
    [DateRangeEnum['7D']]: undefined,
    [DateRangeEnum['30D']]: undefined
  });

  const [selectedPoint, setSelectedPoint] = useState<
    Array<IChartPoint | undefined>
  >([]);

  const [
    getSqlExecPlanCostDataSourceError,
    setGetSqlExecPlanCostDataSourceError
  ] = useState<string | undefined>(undefined);

  const initTime = useMemo(() => dayjs(), []);

  const {
    data,
    loading: getSqlExecPlanCostDataSourceLoading,
    run,
    mutate
  } = useRequest(
    ({
      startTime,
      endTime,
      lastPointEnabled,
      rangeType
    }: getSqlExecPlanCostDataSourceParams) => {
      const startTimeParam = startTime ?? dayjs(initTime).subtract(24, 'hour');
      const endTimeParam = endTime ?? initTime;
      return SqlManage.GetSqlManageSqlAnalysisChartV1({
        sql_manage_id: id ?? '',
        project_name: projectName,
        metric_name: 'explain_cost',
        start_time: translateTimeForRequest(startTimeParam),
        end_time: translateTimeForRequest(endTimeParam),
        latest_point_enabled: !!lastPointEnabled
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          // 根据start_time和end_time填充数据
          const { points } = res.data.data ?? {};
          const convertedPoints: IChartPoint[] =
            points?.map((point) => {
              return {
                ...point,
                x: formatTime(point.x)
              };
            }) ?? [];
          const firstPoint = convertedPoints?.[0];
          const lastPoint = convertedPoints?.[convertedPoints.length - 1];

          if (!selectedPoint.length && !!convertedPoints.length) {
            setSelectedPoint([
              convertedPoints?.[convertedPoints.length - 2],
              lastPoint
            ]);
          }

          if (startTimeParam?.isBefore(dayjs(firstPoint?.x))) {
            convertedPoints?.unshift({
              x: startTimeParam.format('YYYY-MM-DD HH:mm:ss'),
              y: undefined
            });
          }
          if (endTimeParam?.isAfter(dayjs(lastPoint?.x))) {
            convertedPoints?.push({
              x: endTimeParam.format('YYYY-MM-DD HH:mm:ss'),
              y: undefined
            });
          }

          if (rangeType && !memoriedData[rangeType]) {
            setMemoriedData((state) => {
              state[rangeType] = convertedPoints;
              return state;
            });
          }

          if (!!res.data.data?.message) {
            setGetSqlExecPlanCostDataSourceError(res.data.data?.message);
          }
          return convertedPoints;
        }
      });
    },
    {
      manual: true
    }
  );

  const getSqlExecPlanCostDataSource = useCallback(
    (params: getSqlExecPlanCostDataSourceParams) => {
      if (params.rangeType && !!memoriedData[params.rangeType]) {
        mutate(memoriedData[params.rangeType]);
      } else {
        run(params);
      }
    },
    [memoriedData, mutate, run]
  );

  useEffect(() => {
    if (selectedPoint.length && data?.length) {
      selectedPoint?.forEach((i) => {
        if (!data?.some((j) => j?.x === i?.x)) {
          setSelectedPoint((state) => {
            const exceptedPoints = state?.filter((j) => j?.x !== i?.x);
            if (!exceptedPoints.length) {
              const points = data.filter(
                (point) => !!point.x && point.y !== undefined && !!point.info
              );
              return [points?.[points.length - 2], points?.[points.length - 1]];
            }
            return exceptedPoints;
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    data,
    getSqlExecPlanCostDataSourceLoading,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceError,
    initTime,
    selectedPoint,
    setSelectedPoint
  };
};

export default useSqlExecPlanCost;
