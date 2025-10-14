import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { ResponseCode } from '../../../data/common';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';

import SqlAnalyze from '../SqlAnalyze';
import { useTypedParams, useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import useSqlOptimization from '../hooks/useSqlOptimization';
import SqlOptimizationResultDrawer from '../Drawer/SqlOptimizationResultDrawer';

const WorkflowSqlAnalyze = () => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze>();

  const extractQueries = useTypedQuery();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isPerformanceInfoLoaded, { setTrue: setPerformanceInfoLoaded }] =
    useBoolean();

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish }
  ] = useBoolean();
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
        const res = await task.getTaskAnalysisDataV2({
          task_id: urlParams.taskId ?? '',
          number: Number.parseInt(urlParams.sqlNum ?? '', 10),
          affectRowsEnabled
        });
        if (res.data.code === ResponseCode.SUCCESS) {
          if (affectRowsEnabled) {
            setPerformanceInfoLoaded();
          }
          setErrorMessage('');
          const { data } = res.data;
          const queryParams = extractQueries(
            ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze
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
      getSqlAnalyzeFinish,
      startGetSqlAnalyze,
      urlParams.sqlNum,
      urlParams.taskId,
      extractQueries,
      setOptimizationCreationParams,
      setPerformanceInfoLoaded
    ]
  );

  const getPerformanceStatistics = useCallback(async () => {
    getSqlAnalyze(true);
  }, [getSqlAnalyze]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <>
      <SqlAnalyze
        errorType={errorType}
        tableMetas={tableMetas}
        sqlExplain={sqlExplain}
        errorMessage={errorMessage}
        performanceStatistics={performanceStatistics}
        loading={loading}
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

export default WorkflowSqlAnalyze;
