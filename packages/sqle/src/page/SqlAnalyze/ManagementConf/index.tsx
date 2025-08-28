import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/es/result';
import { useCallback, useEffect, useState } from 'react';
import { ResponseCode } from '../../../data/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import SqlAnalyze from '../SqlAnalyze';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useTypedParams, useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useSqlExecPlanCost from '../hooks/useSqlExecPlanCost';
import { DateRangeEnum } from '../SqlAnalyze/ExecPlanCostChart/index.data';
import useSqlOptimization from '../hooks/useSqlOptimization';
import SqlOptimizationResultDrawer from '../Drawer/SqlOptimizationResultDrawer';

const ManagementConfAnalyze = () => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.analyze>();
  const { projectName } = useCurrentProject();

  const extractQueries = useTypedQuery();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish }
  ] = useBoolean();

  const [isPerformanceInfoLoaded, { setTrue: setPerformanceInfoLoaded }] =
    useBoolean();

  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const {
    setOptimizationCreationParams,
    onCreateSqlOptimizationOrview,
    createSqlOptimizationLoading,
    allowSqlOptimization
  } = useSqlOptimization();

  const getSqlAnalyze = useCallback(
    async (affectRowsEnabled = false) => {
      startGetSqlAnalyze();
      try {
        const res = await instance_audit_plan.getAuditPlanSqlAnalysisDataV1({
          project_name: projectName,
          instance_audit_plan_id: urlParams.instanceAuditPlanId ?? '',
          id: urlParams.id ?? '',
          affectRowsEnabled
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          if (affectRowsEnabled) {
            setPerformanceInfoLoaded();
          }
          setErrorMessage('');
          const { data } = res.data;
          const queryParams = extractQueries(
            ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.analyze
          );
          setSqlExplain(data?.sql_explain);
          setTableMetas(data?.table_metas);
          setPerformancesStatistics(data?.performance_statistics);
          setOptimizationCreationParams({
            instance_name: queryParams?.instance_name,
            schema_name: queryParams?.schema,
            sql_content: data?.sql_explain?.sql
          });
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
      startGetSqlAnalyze,
      projectName,
      urlParams.instanceAuditPlanId,
      urlParams.id,
      getSqlAnalyzeFinish,
      extractQueries,
      setOptimizationCreationParams,
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
  } = useSqlExecPlanCost(urlParams.id ?? '');

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
        tableMetas={tableMetas}
        sqlExplain={sqlExplain}
        errorType={errorType}
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
        onCreateSqlOptimizationOrview={onCreateSqlOptimizationOrview}
        createSqlOptimizationLoading={createSqlOptimizationLoading}
        allowSqlOptimization={allowSqlOptimization}
        getPerformanceStatistics={getPerformanceStatistics}
        isPerformanceInfoLoaded={isPerformanceInfoLoaded}
      />
      <SqlOptimizationResultDrawer />
    </>
  );
};

export default ManagementConfAnalyze;
