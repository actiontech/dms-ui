import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { SelectProps } from 'antd';
import useSourceTips from '../../SqlManagement/component/SQLEEIndex/hooks/useSourceTips';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { TFunction } from 'i18next';

const formatAuditTaskLabel = (
  plan: IInstanceAuditPlanResV1,
  t: TFunction
): string => {
  const instanceName =
    plan.instance_name || t('managementConf.list.table.column.staticScanType');
  return `${instanceName} (#${plan.instance_audit_plan_id ?? ''})`;
};

const useAuditTaskSelectOptions = (projectName: string) => {
  const { t } = useTranslation();
  const { generateSourceSelectOptions, loading: auditTaskTypeLoading } =
    useSourceTips();

  const auditTaskTypeOptions = useMemo(
    () =>
      generateSourceSelectOptions?.filter((item) => 'options' in item) ?? [],
    [generateSourceSelectOptions]
  );

  const { data: instanceAuditPlans, loading: auditTaskIdLoading } = useRequest(
    async () => {
      const res = await instance_audit_plan.getInstanceAuditPlansV1({
        project_name: projectName,
        page_index: 1,
        page_size: 9999
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data ?? [];
      }
      return [];
    },
    {
      ready: !!projectName,
      refreshDeps: [projectName]
    }
  );

  const getAuditTaskIdOptions = useCallback(
    (auditTaskType?: string): SelectProps['options'] => {
      const plans = instanceAuditPlans ?? [];
      const filteredPlans = auditTaskType
        ? plans.filter((plan) =>
            plan.audit_plan_types?.some((type) => type.type === auditTaskType)
          )
        : plans;

      return filteredPlans.map((plan) => ({
        label: formatAuditTaskLabel(plan, t),
        value: `${plan.instance_audit_plan_id ?? ''}`
      }));
    },
    [instanceAuditPlans, t]
  );

  return {
    auditTaskTypeOptions,
    getAuditTaskIdOptions,
    instanceAuditPlans,
    auditTaskTypeLoading,
    auditTaskIdLoading
  };
};

export default useAuditTaskSelectOptions;
