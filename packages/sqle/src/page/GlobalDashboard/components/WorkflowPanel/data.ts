import {
  GetGlobalWorkflowListV2FilterStatusEnum,
  GetGlobalWorkflowListV2WorkflowTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { t } from '../../../../locale';

export const workflowTypeLabelDictionary = () => ({
  [GetGlobalWorkflowListV2WorkflowTypeEnum.sql_release]: t(
    'globalDashboard.workflow.workflowTypeLabel.sql_release'
  ),
  [GetGlobalWorkflowListV2WorkflowTypeEnum.data_export]: t(
    'globalDashboard.workflow.workflowTypeLabel.data_export'
  )
});

export const workflowFilterStatusOptions = () => [
  {
    label: t('globalDashboard.workflow.statusLabel.pending_approval'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.pending_approval
  },
  {
    label: t('globalDashboard.workflow.statusLabel.pending_action'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.pending_action
  },
  {
    label: t('globalDashboard.workflow.statusLabel.in_progress'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.in_progress
  },
  {
    label: t('globalDashboard.workflow.statusLabel.exporting'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.exporting
  },
  {
    label: t('globalDashboard.workflow.statusLabel.rejected'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.rejected
  },
  {
    label: t('globalDashboard.workflow.statusLabel.cancelled'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.cancelled
  },
  {
    label: t('globalDashboard.workflow.statusLabel.failed'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.failed
  },
  {
    label: t('globalDashboard.workflow.statusLabel.completed'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.completed
  },
  {
    label: t('globalDashboard.workflow.statusLabel.unknown'),
    value: GetGlobalWorkflowListV2FilterStatusEnum.unknown
  }
];
