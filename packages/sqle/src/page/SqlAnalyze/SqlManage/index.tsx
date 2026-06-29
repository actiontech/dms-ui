import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/lib/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ResponseCode } from '../../../data/common';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { SQLManageAnalyzeUrlParams } from './index.type';
import {
  IPerformanceStatistics,
  ISqlManageRemediation,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';

import SqlAnalyze from '../SqlAnalyze';

const SQLManageAnalyze = () => {
  const urlParams = useParams<SQLManageAnalyzeUrlParams>();
  const { projectName } = useCurrentProject();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [remediationCompare, setRemediationCompare] =
    useState<ISqlManageRemediation>();
  const [remediationLoadFailed, setRemediationLoadFailed] =
    useState<boolean>(false);
  const [
    loading,
    { setTrue: startGetSqlAnalyze, setFalse: getSqlAnalyzeFinish }
  ] = useBoolean();
  const [errorType, setErrorType] = useState<ResultStatusType>('error');

  const getSqlAnalyze = useCallback(async () => {
    startGetSqlAnalyze();
    try {
      const [analysisResult, remediationResult] = await Promise.allSettled([
        SqlManage.GetSqlManageSqlAnalysisV1({
          sql_manage_id: urlParams.sqlManageId ?? '',
          project_name: projectName
        }),
        SqlManage.GetSqlManageRemediationV1({
          sql_manage_id: urlParams.sqlManageId ?? '',
          project_name: projectName
        })
      ]);

      if (
        analysisResult.status === 'fulfilled' &&
        analysisResult.value.data.code === ResponseCode.SUCCESS
      ) {
        setErrorMessage('');
        setSqlExplain(analysisResult.value.data.data?.sql_explain);
        setTableMetas(analysisResult.value.data.data?.table_metas);
        setPerformancesStatistics(
          analysisResult.value.data.data?.performance_statistics
        );
      } else {
        setSqlExplain(undefined);
        setTableMetas(undefined);
        setPerformancesStatistics(undefined);
        if (analysisResult.status === 'fulfilled') {
          if (analysisResult.value.data.code === ResponseCode.NotSupportDML) {
            setErrorType('info');
          } else {
            setErrorType('error');
          }
          setErrorMessage(analysisResult.value.data.message ?? '');
        } else {
          setErrorType('error');
          setErrorMessage(
            (analysisResult.reason as { message?: string })?.message ?? ''
          );
        }
      }

      if (
        remediationResult.status === 'fulfilled' &&
        remediationResult.value.data.code === ResponseCode.SUCCESS
      ) {
        setRemediationCompare(remediationResult.value.data.data);
        setRemediationLoadFailed(false);
      } else {
        setRemediationCompare(undefined);
        setRemediationLoadFailed(true);
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
      remediationCompare={remediationCompare}
      remediationLoadFailed={remediationLoadFailed}
      loading={loading}
    />
  );
};

export default SQLManageAnalyze;
