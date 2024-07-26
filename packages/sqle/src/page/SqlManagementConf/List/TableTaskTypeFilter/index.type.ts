import { IAuditPlanTypesV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type TableTaskTypeFilterProps = {
  updateParams: (data: { dataSourceType: string; taskType: string }) => void;
  auditPlanTypes: IAuditPlanTypesV1[];
};
