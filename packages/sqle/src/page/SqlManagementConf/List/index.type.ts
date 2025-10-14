import { IGetInstanceAuditPlansV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import { PageInfoWithoutIndexAndSize } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { InstanceAuditPlanStatusEnum } from './index.enum';

export type InstanceAuditPlanTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetInstanceAuditPlansV1Params,
  'project_name'
> & {
  filter_by_active_status?: InstanceAuditPlanStatusEnum;
};
