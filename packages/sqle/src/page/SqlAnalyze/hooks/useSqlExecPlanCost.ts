import { useRequest } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';
import { translateTimeForRequest } from '@actiontech/shared/lib/utils/Common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useState } from 'react';

export type getSqlExecPlanCostDataSourceParams = {
  startTime?: Dayjs;
  endTime?: Dayjs;
  lastPointEnabled?: boolean;
};

const useSqlExecPlanCost = (id: string) => {
  const { projectName } = useCurrentProject();

  const [initTime, setInitTime] = useState<string>();

  const {
    data,
    loading: getSqlExecPlanCostDataSourceLoading,
    run: getSqlExecPlanCostDataSource,
    error: getSqlExecPlanCostDataSourceError
  } = useRequest(
    ({
      startTime,
      endTime,
      lastPointEnabled
    }: getSqlExecPlanCostDataSourceParams) => {
      const startTimeParam = startTime ?? dayjs().subtract(24, 'hour');
      const endTimeParam = endTime ?? dayjs();
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
          const firstPoint = points?.[0];
          const lastPoint = points?.[points.length - 1];
          if (!initTime) {
            setInitTime(lastPoint?.x);
          }
          if (startTimeParam?.isBefore(dayjs(firstPoint?.x))) {
            points?.unshift({
              x: translateTimeForRequest(startTimeParam)
            });
          }
          if (endTimeParam?.isAfter(dayjs(lastPoint?.x))) {
            points?.push({ x: translateTimeForRequest(endTimeParam) });
          }
          return points;
        }
      });
    },
    {
      manual: true
    }
  );

  return {
    data,
    getSqlExecPlanCostDataSourceLoading,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceError,
    initTime
  };
};

export default useSqlExecPlanCost;
