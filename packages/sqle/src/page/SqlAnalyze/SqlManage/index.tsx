import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { ResponseCode } from '../../../data/common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlAnalyze from '../SqlAnalyze';
import { useTypedParams } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useRequest } from 'ahooks';
import dayjs, { Dayjs } from 'dayjs';
import { translateTimeForRequest } from '@actiontech/shared/lib/utils/Common';

const SQLManageAnalyze = () => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_MANAGEMENT.analyze>();
  const { projectName } = useCurrentProject();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();

  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish }
  ] = useBoolean();
  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const res = await SqlManage.GetSqlManageSqlAnalysisV1({
        sql_manage_id: urlParams.sqlManageId ?? '',
        project_name: projectName
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        setErrorMessage('');
        setSqlExplain(res.data.data?.sql_explain);
        setTableMetas(res.data.data?.table_metas);
        setPerformancesStatistics(res.data.data?.performance_statistics);
      } else {
        if (res.data.code === ResponseCode.NotSupportDML) {
          setErrorType('info');
        } else {
          setErrorType('error');
        }
        setErrorMessage(res.data.message ?? '');
      }
    } finally {
      getSqlAnalyzeFinish();
    }
  }, [
    getSqlAnalyzeFinish,
    projectName,
    startGetSqlAnalyze,
    urlParams.sqlManageId
  ]);

  const {
    data,
    loading: getSqlExecPlanCostDataSourceLoading,
    run: getSqlExecPlanCostDataSource,
    error: getSqlExecPlanCostDataSourceError
  } = useRequest(
    (startTime?: Dayjs, endTime?: Dayjs, isCustomDateRange?: boolean) => {
      const startTimeParam = startTime ?? dayjs().subtract(24, 'hour');
      const endTimeParam = endTime ?? dayjs();
      return SqlManage.GetSqlManageSqlAnalysisChartV1({
        sql_manage_id: urlParams.sqlManageId ?? '',
        project_name: projectName,
        metric_name: 'explain_cost',
        start_time: translateTimeForRequest(startTimeParam),
        end_time: translateTimeForRequest(endTimeParam)
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          // 根据start_time和end_time填充数据
          const { points } = res.data.data ?? {};
          const firstPoint = points?.[0];
          const lastPoint = points?.[points.length - 1];
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
    }
  );

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <SqlAnalyze
      errorType={errorType}
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      loading={loading}
      sqlExecPlanCostDataSource={data}
      getSqlExecPlanCostDataSourceLoading={getSqlExecPlanCostDataSourceLoading}
      getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSource}
      getSqlExecPlanCostDataSourceError={
        getSqlExecPlanCostDataSourceError?.message
      }
      showExecPlanCostChart
    />
  );
};

export default SQLManageAnalyze;
