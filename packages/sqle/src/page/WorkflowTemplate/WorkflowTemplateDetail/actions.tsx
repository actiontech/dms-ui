import { t } from '../../../locale';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ActionButton } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { getWorkflowTemplatesV1FilterWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';

export const WorkflowTemplateTableActions = (
  onEdit: (record?: IWorkflowTemplateDetailResV1) => void,
  onDelete: (record?: IWorkflowTemplateDetailResV1) => void,
  onSetDefault: (record?: IWorkflowTemplateDetailResV1) => void
): ActiontechTableActionsWithPermissions<IWorkflowTemplateDetailResV1> => {
  return {
    buttons: [
      {
        text: t('common.edit'),
        key: 'edit-workflow-template',
        buttonProps: (record) => ({
          onClick: () => onEdit(record)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.UPDATE
      },
      {
        text: t('workflowTemplate.list.operator.setDefault'),
        key: 'set-default-workflow-template',
        buttonProps: (record) => ({
          disabled: !!record?.is_default,
          onClick: () => onSetDefault(record)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.SET_DEFAULT
      },
      {
        text: t('common.delete'),
        key: 'delete-workflow-template',
        buttonProps: (record) => ({
          danger: true,
          disabled: !!record?.is_default
        }),
        confirm: (record) => ({
          title: t('workflowTemplate.delete.confirm', {
            name: record?.workflow_template_name ?? ''
          }),
          onConfirm: () => onDelete(record)
        }),
        permissions: PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.DELETE
      }
    ]
  };
};

export const WorkflowTemplatePageHeaderActions = (
  projectID: string,
  workflowType: getWorkflowTemplatesV1FilterWorkflowTypeEnum
): Record<'create-workflow-template', React.ReactNode> => ({
  'create-workflow-template': (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.WORKFLOW_TEMPLATE.CREATE}
    >
      <ActionButton
        type="primary"
        icon={<PlusOutlined color="currentColor" width={10} height={10} />}
        text={t('workflowTemplate.list.operator.create')}
        actionType="navigate-link"
        link={{
          to: ROUTE_PATHS.SQLE.PROGRESS.create,
          params: {
            projectID,
            workflowType
          }
        }}
      />
    </PermissionControl>
  )
});
