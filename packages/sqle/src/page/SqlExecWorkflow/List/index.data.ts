import { t } from '../../../locale';
import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';

export const WorkflowStatusDictionary: Record<
  keyof typeof getWorkflowsV1FilterStatusEnum,
  string
> = {
  [getWorkflowsV1FilterStatusEnum.wait_for_audit]: t(
    'execWorkflow.common.workflowStatus.waitForAudit'
  ),
  [getWorkflowsV1FilterStatusEnum.wait_for_execution]: t(
    'execWorkflow.common.workflowStatus.waitForExecution'
  ),
  [getWorkflowsV1FilterStatusEnum.canceled]: t(
    'execWorkflow.common.workflowStatus.canceled'
  ),
  [getWorkflowsV1FilterStatusEnum.rejected]: t(
    'execWorkflow.common.workflowStatus.reject'
  ),
  [getWorkflowsV1FilterStatusEnum.exec_failed]: t(
    'execWorkflow.common.workflowStatus.reject'
  ),
  [getWorkflowsV1FilterStatusEnum.finished]: t(
    'execWorkflow.common.workflowStatus.finished'
  ),
  [getWorkflowsV1FilterStatusEnum.executing]: t(
    'execWorkflow.common.workflowStatus.executing'
  )
};
