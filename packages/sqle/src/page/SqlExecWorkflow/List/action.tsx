import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { t } from '../../../locale';
import { DownArrowLineOutlined, PlusOutlined } from '@actiontech/icons';

export const SqlExecWorkflowExportAction = (
  exportWorkflow: () => void,
  exportWorkflowDisabled: boolean
): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.EXPORT}
    >
      <ActionButton
        text={t('execWorkflow.list.exportWorkflow.buttonText')}
        icon={<DownArrowLineOutlined />}
        onClick={exportWorkflow}
        disabled={exportWorkflowDisabled}
      />
    </PermissionControl>
  );
};

export const SqlExecWorkflowCreateAction = (projectID: string): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE}
    >
      <ActionButton
        type="primary"
        actionType="navigate-link"
        text={t('execWorkflow.list.createButtonText')}
        icon={<PlusOutlined width={10} height={10} color="currentColor" />}
        link={{ to: `/sqle/project/${projectID}/exec-workflow/create` }}
      />
    </PermissionControl>
  );
};