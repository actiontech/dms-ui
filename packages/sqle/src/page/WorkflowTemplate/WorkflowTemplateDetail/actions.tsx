import { t } from '../../../locale';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const WorkflowTemplateTableActions: (
  onEdit: (record: IWorkflowTemplateDetailResV1) => void
) => ActiontechTableActionsWithPermissions<IWorkflowTemplateDetailResV1> = (
  onEdit
) => ({
  buttons: [
    {
      key: 'edit-workflow-template',
      text: t('common.edit'),
      buttonProps: (record) => ({
        onClick: () => onEdit(record ?? {})
      }),
      permissions: PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE
    }
  ]
});
