import {
  GetGlobalWorkflowListV2FilterCardEnum,
  GetGlobalWorkflowListV2WorkflowTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { GlobalDashboardWorkflowTableFilterParam } from '../index.type';

export type ExportGlobalWorkflowButtonProps = {
  filterCard: GetGlobalWorkflowListV2FilterCardEnum;
  workflowType: GetGlobalWorkflowListV2WorkflowTypeEnum | null;
  projectId?: string;
  instanceId?: string;
  tableFilterInfo: GlobalDashboardWorkflowTableFilterParam;
  searchKeyword?: string;
  onExportFinished?: () => void;
};
