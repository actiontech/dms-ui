import { useBoolean } from 'ahooks';
import { ResultStatusType } from 'antd/es/result';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResponseCode } from '../../../data/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import SqlAnalyze from '../SqlAnalyze';
import { AuditPlanReportSqlAnalyzeUrlParams } from './index.type';
import {
  IPerformanceStatistics,
  ISqlManage,
  ISqlManageRemediation,
  ISQLExplain,
  ITableMetas,
  IInstanceAuditPlanDetailResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { ISqlManageRuleExceptionContext } from '../../RuleException/index.data';
import { resolveDbTypeFromAuditResults } from '../../RuleException/utils';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';

type ISqlManageWithInstanceId = ISqlManage & {
  instance_id?: string;
};

const ManagementConfAnalyze = () => {
  const urlParams = useParams<AuditPlanReportSqlAnalyzeUrlParams>();
  const { projectName } = useCurrentProject();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [sqlExplain, setSqlExplain] = useState<ISQLExplain>();
  const [tableMetas, setTableMetas] = useState<ITableMetas>();
  const [performanceStatistics, setPerformancesStatistics] =
    useState<IPerformanceStatistics>();
  const [remediationCompare, setRemediationCompare] =
    useState<ISqlManageRemediation>();
  const [sqlManageRecord, setSqlManageRecord] = useState<ISqlManage>();
  const [instanceAuditPlanDetail, setInstanceAuditPlanDetail] =
    useState<IInstanceAuditPlanDetailResV1>();
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
      const [analysisResult, remediationResult, listResult, auditPlanResult] =
        await Promise.allSettled([
          instance_audit_plan.getAuditPlanSqlAnalysisDataV1({
            project_name: projectName,
            instance_audit_plan_id: urlParams.instanceAuditPlanId ?? '',
            id: urlParams.id ?? ''
          }),
          SqlManage.GetSqlManageRemediationV1({
            project_name: projectName,
            sql_manage_id: urlParams.id ?? ''
          }),
          SqlManage.GetSqlManageListV2({
            project_name: projectName,
            page_index: 1,
            page_size: 100
          }),
          instance_audit_plan.getInstanceAuditPlanDetailV1({
            project_name: projectName,
            instance_audit_plan_id: urlParams.instanceAuditPlanId ?? ''
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

      if (
        listResult.status === 'fulfilled' &&
        listResult.value.data.code === ResponseCode.SUCCESS
      ) {
        const matchedRecord = listResult.value.data.data?.find(
          (item) => `${item.id}` === `${urlParams.id ?? ''}`
        );
        setSqlManageRecord(matchedRecord);
      } else {
        setSqlManageRecord(undefined);
      }

      if (
        auditPlanResult.status === 'fulfilled' &&
        auditPlanResult.value.data.code === ResponseCode.SUCCESS
      ) {
        setInstanceAuditPlanDetail(auditPlanResult.value.data.data);
      } else {
        setInstanceAuditPlanDetail(undefined);
      }
    } finally {
      getSqlAnalyzeFinish();
    }
  }, [
    getSqlAnalyzeFinish,
    projectName,
    startGetSqlAnalyze,
    urlParams.id,
    urlParams.instanceAuditPlanId
  ]);

  useEffect(() => {
    getSqlAnalyze();
  }, [getSqlAnalyze]);

  const sqlManageContext = useMemo<
    ISqlManageRuleExceptionContext | undefined
  >(() => {
    const sql_fingerprint =
      sqlManageRecord?.sql_fingerprint ?? remediationCompare?.sql_fingerprint;
    if (!sql_fingerprint) {
      return undefined;
    }
    const record = sqlManageRecord as ISqlManageWithInstanceId | undefined;
    const db_type =
      resolveDbTypeFromAuditResults(sqlManageRecord?.audit_result) ??
      resolveDbTypeFromAuditResults(sqlManageRecord?.first_audit_result) ??
      resolveDbTypeFromAuditResults(remediationCompare?.latest_audit_result) ??
      resolveDbTypeFromAuditResults(remediationCompare?.first_audit_result) ??
      instanceAuditPlanDetail?.instance_type?.trim();
    return {
      sql_fingerprint,
      instance_id: record?.instance_id,
      source: sqlManageRecord?.source,
      db_type
    };
  }, [
    instanceAuditPlanDetail?.instance_type,
    remediationCompare,
    sqlManageRecord
  ]);

  return (
    <SqlAnalyze
      tableMetas={tableMetas}
      sqlExplain={sqlExplain}
      errorType={errorType}
      errorMessage={errorMessage}
      performanceStatistics={performanceStatistics}
      remediationCompare={remediationCompare}
      remediationLoadFailed={remediationLoadFailed}
      sqlManageId={urlParams.id}
      sqlManageContext={sqlManageContext}
      status={sqlManageRecord?.status}
      onRemediationRefresh={getSqlAnalyze}
      loading={loading}
    />
  );
};

export default ManagementConfAnalyze;
