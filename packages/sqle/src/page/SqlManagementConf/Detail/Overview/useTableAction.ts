import { UpdateAuditPlanStatusReqV1ActiveEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';

export const useTableAction = () => {
  const { projectName } = useCurrentProject();

  const { runAsync: disabledAction, loading: disabledActionPending } =
    useRequest(
      (id: string, auditPlanId: string) =>
        SqleApi.InstanceAuditPlanService.updateAuditPlanStatusV1({
          project_name: projectName,
          instance_audit_plan_id: id,
          audit_plan_id: auditPlanId,
          active: UpdateAuditPlanStatusReqV1ActiveEnum.disabled
        }),
      {
        manual: true
      }
    );

  const { runAsync: enabledAction, loading: enabledActionPending } = useRequest(
    (id: string, auditPlanId: string) =>
      SqleApi.InstanceAuditPlanService.updateAuditPlanStatusV1({
        project_name: projectName,
        instance_audit_plan_id: id,
        audit_plan_id: auditPlanId,
        active: UpdateAuditPlanStatusReqV1ActiveEnum.normal
      }),
    {
      manual: true
    }
  );

  const { runAsync: deleteAction, loading: deleteActionPending } = useRequest(
    (id: string, auditPlanId: string) =>
      SqleApi.InstanceAuditPlanService.deleteAuditPlanByTypeV1({
        project_name: projectName,
        instance_audit_plan_id: id,
        audit_plan_id: auditPlanId
      }),
    {
      manual: true
    }
  );

  const { runAsync: resetTokenAction, loading: resetTokenActionPending } =
    useRequest(
      (id: string) => {
        return SqleApi.InstanceAuditPlanService.refreshAuditPlanTokenV1({
          project_name: projectName,
          instance_audit_plan_id: id,
          expires_in_days: 365
        });
      },
      { manual: true }
    );

  return {
    disabledAction,
    enabledAction,
    enabledActionPending,
    disabledActionPending,
    deleteAction,
    deleteActionPending,
    resetTokenAction,
    resetTokenActionPending
  };
};
