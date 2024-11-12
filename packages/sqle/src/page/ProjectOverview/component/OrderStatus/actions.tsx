import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { t } from '../../../../locale';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const CreateSqlExecWorkflowAction = (projectID: string): ReactNode => {
  return (
    <PermissionControl
      permission={PERMISSIONS.ACTIONS.SQLE.SQL_EXEC_WORKFLOW.CREATE}
    >
      <ActionButton
        actionType="navigate-link"
        text={t('execWorkflow.list.createButtonText')}
        link={{
          to: ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create,
          params: { projectID }
        }}
        size="small"
      />
    </PermissionControl>
  );
};
