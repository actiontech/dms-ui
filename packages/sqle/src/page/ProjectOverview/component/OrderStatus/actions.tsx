import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { t } from '../../../../locale';

export const CreateSqlExecWorkflowAction = (projectID: string): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE}
    >
      <ActionButton
        actionType="navigate-link"
        text={t('execWorkflow.list.createButtonText')}
        link={{ to: `/sqle/project/${projectID}/exec-workflow/create` }}
        size="small"
      />
    </PermissionControl>
  );
};
