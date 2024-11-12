import { t } from '../../../locale';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ActionButton } from '@actiontech/shared';
import { EditOutlined } from '@ant-design/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const WorkflowTemplatePageHeaderActions = (
  projectID: string,
  templateName?: string
): Record<'update-workflow-template', React.ReactNode> => ({
  'update-workflow-template': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE}
    >
      <ActionButton
        type="primary"
        icon={<EditOutlined />}
        text={t('workflowTemplate.detail.updateTemplate')}
        actionType="navigate-link"
        link={{
          to: ROUTE_PATHS.SQLE.PROGRESS.update,
          params: {
            projectID,
            workflowName: templateName ?? ''
          }
        }}
      />
    </PermissionControl>
  )
});
