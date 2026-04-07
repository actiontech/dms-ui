import { GetGlobalWorkflowListV2WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { t } from '../../../../locale';

export const workflowTypeLabelDictionary = () => ({
  [GetGlobalWorkflowListV2WorkflowTypeEnum.sql_release]: t(
    'globalDashboard.workflow.workflowTypeLabel.sql_release'
  ),
  [GetGlobalWorkflowListV2WorkflowTypeEnum.data_export]: t(
    'globalDashboard.workflow.workflowTypeLabel.data_export'
  )
});
