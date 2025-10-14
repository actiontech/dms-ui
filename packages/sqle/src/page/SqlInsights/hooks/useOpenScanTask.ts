import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { GetSqlPerformanceInsightsMetricNameEnum } from '@actiontech/shared/lib/api/sqle/service/SqlInsight/index.enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import useScanTypeVerify from '../../SqlManagementConf/Common/ConfForm/useScanTypeVerify';

const useOpenScanTask = (
  selectedInstance?: string,
  instanceEnvironmentTag?: string
) => {
  const { projectName, projectID } = useCurrentProject();
  const navigate = useTypedNavigate();

  const {
    isPerformanceCollectScanType,
    isProcesslistScanType,
    isSlowLogScanType,
    isTopSqlScanType
  } = useScanTypeVerify();

  const { data: auditPlanData, loading: getAuditPlanDataLoading } = useRequest(
    () => {
      return SqleApi.InstanceAuditPlanService.getInstanceAuditPlansV2({
        project_name: projectName,
        page_index: 1,
        page_size: 1000,
        filter_by_instance_id: selectedInstance
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.[0];
        }
      });
    },
    {
      ready: !!selectedInstance,
      refreshDeps: [selectedInstance]
    }
  );

  const mapMetricNameToAuditPlanType = useMemo(() => {
    return {
      [GetSqlPerformanceInsightsMetricNameEnum.comprehensive_trend]:
        isPerformanceCollectScanType,
      [GetSqlPerformanceInsightsMetricNameEnum.active_session_trend]:
        isProcesslistScanType,
      [GetSqlPerformanceInsightsMetricNameEnum.top_sql_trend]: isTopSqlScanType,
      [GetSqlPerformanceInsightsMetricNameEnum.slow_sql_trend]:
        isSlowLogScanType
    };
  }, [
    isPerformanceCollectScanType,
    isProcesslistScanType,
    isSlowLogScanType,
    isTopSqlScanType
  ]);

  const onCreateSqlManagementConf = useCallback(
    (metricName: GetSqlPerformanceInsightsMetricNameEnum) => {
      // auditPlanData不存在，说明当前数据源没有配置管控任务，跳转创建页面
      if (!auditPlanData) {
        navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create, {
          params: {
            projectID
          },
          queries: {
            instance_id: selectedInstance,
            environment_tag: instanceEnvironmentTag
          }
        });
      } else {
        const isAuditPlanTypeExisted = auditPlanData?.audit_plan_types?.some(
          (i) => mapMetricNameToAuditPlanType[metricName](i.type)
        );
        // audit_plan_types中没有对应的扫描任务 则跳转编辑页面
        if (!isAuditPlanTypeExisted) {
          navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update, {
            params: {
              projectID,
              id: `${auditPlanData.instance_audit_plan_id}`
            }
          });
        } else {
          //audit_plan_types中存在对应的扫描任务 则跳转详情概览页面
          navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail, {
            params: {
              projectID,
              id: `${auditPlanData.instance_audit_plan_id}`
            }
          });
        }
      }
    },
    [
      auditPlanData,
      navigate,
      projectID,
      selectedInstance,
      instanceEnvironmentTag,
      mapMetricNameToAuditPlanType
    ]
  );

  return {
    getAuditPlanDataLoading,
    onCreateSqlManagementConf
  };
};

export default useOpenScanTask;
