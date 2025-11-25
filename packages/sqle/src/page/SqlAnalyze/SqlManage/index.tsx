import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { ResponseCode } from '../../../data/common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { SQLManageAnalyzeUrlParams } from './index.type';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlAnalyze from '../SqlAnalyze';
import useSqlOptimization from '../hooks/useSqlOptimization';
import SqlOptimizationResultDrawer from '../Drawer/SqlOptimizationResultDrawer';

const SQLManageAnalyze = () => {
  const urlParams = useParams<SQLManageAnalyzeUrlParams>();
  const [searchParams] = useSearchParams();
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

  const {
    setOptimizationCreationParams,
    onCreateSqlOptimizationOrView,
    onViewOptimizationResult,
    optimizationRecordId,
    createSqlOptimizationLoading,
    allowSqlOptimization
  } = useSqlOptimization();

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
        setOptimizationCreationParams({
          instance_name: searchParams?.get('instance_name') ?? '',
          schema_name: searchParams?.get('schema') ?? '',
          sql_content: res.data.data?.sql_explain?.sql
        });
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
    urlParams.sqlManageId,
    searchParams,
    setOptimizationCreationParams
  ]);

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
        onCreateSqlOptimizationOrView={onCreateSqlOptimizationOrView}
        onViewOptimizationResult={onViewOptimizationResult}
        optimizationRecordId={optimizationRecordId}
        createSqlOptimizationLoading={createSqlOptimizationLoading}
        allowSqlOptimization={allowSqlOptimization}
      />
      <SqlOptimizationResultDrawer />
    </>
  );
};

export default SQLManageAnalyze;
