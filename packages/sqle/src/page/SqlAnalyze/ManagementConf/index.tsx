import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/es/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResponseCode } from '../../../data/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlAnalyze from '../SqlAnalyze';
import { AuditPlanReportSqlAnalyzeUrlParams } from './index.type';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';

const ManagementConfAnalyze = () => {
  const urlParams = useParams<AuditPlanReportSqlAnalyzeUrlParams>();
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
      const res = await instance_audit_plan.getAuditPlanSqlAnalysisDataV1({
        project_name: projectName,
        instance_audit_plan_id: urlParams.instanceAuditPlanId ?? '',
        id: urlParams.id ?? ''
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
    startGetSqlAnalyze,
    projectName,
    urlParams.instanceAuditPlanId,
    urlParams.id,
    getSqlAnalyzeFinish
  ]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  return (
    <SqlAnalyze
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorType={errorType}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      loading={loading}
    />
  );
};

export default ManagementConfAnalyze;
