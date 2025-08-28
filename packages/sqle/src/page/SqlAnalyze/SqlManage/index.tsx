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
import { useCurrentProject } from '@actiontech/shared/lib/features';
import SqlAnalyze from '../SqlAnalyze';
import { useTypedParams } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useSqlExecPlanCost from '../hooks/useSqlExecPlanCost';
import { DateRangeEnum } from '../SqlAnalyze/ExecPlanCostChart/index.data';

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

  const [isPerformanceInfoLoaded, { setTrue: setPerformanceInfoLoaded }] =
    useBoolean();

  const getSqlAnalyze = useCallback(
    async (affectRowsEnabled = false) => {
      startGetSqlAnalyze();
      try {
        const res = await SqlManage.GetSqlManageSqlAnalysisV1({
          sql_manage_id: urlParams.sqlManageId ?? '',
          project_name: projectName,
          affectRowsEnabled
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          if (affectRowsEnabled) {
            setPerformanceInfoLoaded();
          }
          setErrorMessage('');
          const { data } = res.data;
          setSqlExplain(data?.sql_explain);
          setTableMetas(data?.table_metas);
          setPerformancesStatistics(data?.performance_statistics);
        } else {
          if (res.data.code === ResponseCode.NotSupportDML) {
            setErrorType('info');
          } else {
            if (res.data.code === ResponseCode.NotSupportDML) {
              setErrorType('info');
            } else {
              setErrorType('error');
            }
            setErrorMessage(res.data.message ?? '');
          }
        }
      } finally {
        getSqlAnalyzeFinish();
      }
    },
    [
      getSqlAnalyzeFinish,
      projectName,
      startGetSqlAnalyze,
      urlParams.sqlManageId,
      setPerformanceInfoLoaded
    ]
  );

  const {
    data,
    getSqlExecPlanCostDataSourceLoading,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceError,
    initTime,
    selectedPoint,
    setSelectedPoint
  } = useSqlExecPlanCost(urlParams.sqlManageId ?? '');

  const getPerformanceStatistics = useCallback(async () => {
    getSqlAnalyze(true);
  }, [getSqlAnalyze]);

  useEffect(() => {
    getSqlAnalyze();
    getSqlExecPlanCostDataSource({
      lastPointEnabled: true,
      rangeType: DateRangeEnum['24H']
    });
  }, [getSqlAnalyze, getSqlExecPlanCostDataSource]);

  return (
    <>
      <SqlAnalyze
        errorType={errorType}
        tableMetas={tableMetas}
        sqlExplain={sqlExplain}
        errorMessage={errorMessage}
        performanceStatistics={performanceStatistics}
        loading={loading}
        sqlExecPlanCostDataSource={data}
        getSqlExecPlanCostDataSourceLoading={
          getSqlExecPlanCostDataSourceLoading
        }
        getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSource}
        getSqlExecPlanCostDataSourceError={getSqlExecPlanCostDataSourceError}
        showExecPlanCostChart
        initTime={initTime}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
        getPerformanceStatistics={getPerformanceStatistics}
        isPerformanceInfoLoaded={isPerformanceInfoLoaded}
      />
    </>
  );
};

export default SQLManageAnalyze;
