import { t } from '../../../locale';
import { IPipelineDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ActionButton } from '@actiontech/shared/lib/components/ActionButton';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { PlusOutlined } from '@actiontech/icons';

export const PipelineConfigurationListPageHeaderActions = (
  projectID: string
): Record<'create-pipeline', React.ReactNode> => ({
  'create-pipeline': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.PIPELINE_CONFIGURATION.CREATE}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        actionType="navigate-link"
        link={{
          to: ROUTE_PATHS.SQLE.PIPELINE_CONFIGURATION.create,
          params: { projectID }
        }}
        text={t('pipelineConfiguration.createPipeline')}
      />
    </PermissionControl>
  )
});

export const PipelineConfigurationListActions: (
  onEdit: (id?: number) => void,
  onDelete: (id?: number) => void
) => ActiontechTableActionsWithPermissions<IPipelineDetail> = (
  onEdit,
  onDelete
) => {
  return [
    {
      key: 'edit-button',
      text: t('common.edit'),
      buttonProps: (record) => ({
        onClick: () => onEdit(record?.id)
      }),
      permissions: PERMISSIONS.ACTIONS.SQLE.PIPELINE_CONFIGURATION.EDIT
    },
    {
      key: 'delete-button',
      text: t('common.delete'),
      buttonProps: () => ({ danger: true }),
      confirm: (record) => ({
        title: t('pipelineConfiguration.table.confirmDelete'),
        onConfirm: () => onDelete(record?.id)
      }),
      permissions: PERMISSIONS.ACTIONS.SQLE.PIPELINE_CONFIGURATION.DELETE
    }
  ];
};
