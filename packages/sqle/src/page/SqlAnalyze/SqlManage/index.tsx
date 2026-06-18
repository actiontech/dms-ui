import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { ResponseCode } from '../../../data/common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  IPerformanceStatistics,
  ISqlManageRemediation,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import SqlAnalyze from '../SqlAnalyze';
import { useTypedParams, useTypedQuery } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import useSqlExecPlanCost from '../hooks/useSqlExecPlanCost';
import { DateRangeEnum } from '../SqlAnalyze/ExecPlanCostChart/index.data';
import useSqlOptimization from '../hooks/useSqlOptimization';
import SqlOptimizationResultDrawer from '../Drawer/SqlOptimizationResultDrawer';

const SQLManageAnalyze = () => {
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_MANAGEMENT.analyze>();
  const { projectName } = useCurrentProject();

  const extractQueries = useTypedQuery();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [remediationCompare, setRemediationCompare] =
    useState<ISqlManageRemediation>();
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish }
  ] = useBoolean();
  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const [res, remediationRes] = await Promise.all([
        SqlManage.GetSqlManageSqlAnalysisV1({
          sql_manage_id: urlParams.sqlManageId ?? '',
          project_name: projectName
        }),
        SqlManage.GetSqlManageRemediationV1({
          sql_manage_id: urlParams.sqlManageId ?? '',
          project_name: projectName
        })
      ]);

      if (res.data.code !== ResponseCode.SUCCESS) {
        if (remediationRes.data.code !== ResponseCode.SUCCESS) {
          if (res.data.code === ResponseCode.NotSupportDML) {
            setErrorType('info');
          } else {
            setErrorType('error');
          }
          setErrorMessage(res.data.message ?? '');
          return;
        }
      }

      setErrorMessage('');
      setSqlExplain(res.data.data?.sql_explain);
      setTableMetas(res.data.data?.table_metas);
      setPerformancesStatistics(res.data.data?.performance_statistics);
      if (remediationRes.data.code === ResponseCode.SUCCESS) {
        setRemediationCompare(remediationRes.data.data);
      }
    },
    [
      getSqlAnalyzeFinish,
      projectName,
      startGetSqlAnalyze,
      urlParams.sqlManageId,
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
    <SqlAnalyze
      errorType={errorType}
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      remediationCompare={remediationCompare}
      loading={loading}
    />
  );
};

export default SQLManageAnalyze;
