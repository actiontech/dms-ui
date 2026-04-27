import { ROUTE_PATHS } from '@actiontech/dms-kit';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { EditOutlined } from '@ant-design/icons';
import { getWorkflowTemplateV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { ActionButton } from '@actiontech/shared';
import { t } from '../../../locale';

export const workflowTemplateDetailAction = (params: {
  projectID: string;
  templateName?: string;
  workflowType: getWorkflowTemplateV1WorkflowTypeEnum;
}) => {
  const { projectID, templateName, workflowType } = params;
  return (
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
          },
          queries: {
            workflowType
          }
        }}
      />
    </PermissionControl>
  );
};
