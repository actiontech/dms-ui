import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';

export const useTableAction = () => {
  const { projectName } = useCurrentProject();

  const { runAsync: disabledAction, loading: disabledActionPending } =
    useRequest(
      (id: string, auditPlanType: string) =>
        instance_audit_plan.stopAuditPlanV1({
          project_name: projectName,
          instance_audit_plan_id: id,
          audit_plan_type: auditPlanType
        }),
      {
        manual: true
      }
    );

  return {
    disabledAction,
    disabledActionPending
  };
};
