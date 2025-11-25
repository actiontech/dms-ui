import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/es/result';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ResponseCode } from '../../../data/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlAnalyze from '../SqlAnalyze';
import { AuditPlanReportSqlAnalyzeUrlParams } from './index.type';
import {
  IPerformanceStatistics,
  ISQLExplain,
  ITableMetas
} from '@actiontech/shared/lib/api/sqle/service/common';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import useSqlOptimization from '../hooks/useSqlOptimization';
import SqlOptimizationResultDrawer from '../Drawer/SqlOptimizationResultDrawer';

const AuditPlanSqlAnalyze = () => {
  const urlParams = useParams<AuditPlanReportSqlAnalyzeUrlParams>();
  const { projectName } = useCurrentProject();
  const [searchParams] = useSearchParams();

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
      const res = await audit_plan.getAuditPlantAnalysisDataV2({
        project_name: projectName,
        audit_plan_report_id: urlParams.reportId ?? '',
        number: urlParams.sqlNum ?? '',
        audit_plan_name: urlParams.auditPlanName ?? ''
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
    startGetSqlAnalyze,
    projectName,
    urlParams.reportId,
    urlParams.sqlNum,
    urlParams.auditPlanName,
    getSqlAnalyzeFinish,
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

export default AuditPlanSqlAnalyze;
