import { ActiontechTableActionsConfig } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { IGlobalWorkflowListItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { t } from '../../../../locale';

export const workflowPanelTableActions = (
  filterCard: GetGlobalWorkflowListV2FilterCardEnum,
  onOpenWorkflow: (record: IGlobalWorkflowListItem) => void
): ActiontechTableActionsConfig<IGlobalWorkflowListItem> => {
  return {
    width: 100,
    buttons: [
      {
        key: 'go_handle',
        text: t('globalDashboard.workflow.action.goHandle'),
        buttonProps: (record) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (record) {
              onOpenWorkflow(record);
            }
          }
        }),
        permissions: () =>
          filterCard === GetGlobalWorkflowListV2FilterCardEnum.pending_for_me
      },
      {
        key: 'detail',
        text: t('globalDashboard.workflow.action.detail'),
        buttonProps: (record) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (record) {
              onOpenWorkflow(record);
            }
          }
        }),
        permissions: () =>
          filterCard ===
            GetGlobalWorkflowListV2FilterCardEnum.initiated_by_me ||
          filterCard === GetGlobalWorkflowListV2FilterCardEnum.archived
      }
    ]
  };
};
