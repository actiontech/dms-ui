import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { t } from '../../../locale';
import { PlusOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const SqlAuditPageHeaderActions = (
  projectID: string
): Record<'create-audit', React.ReactNode> => {
  return {
    'create-audit': (
      <PermissionControl permission={PERMISSIONS.ACTIONS.SQLE.SQL_AUDIT.CREATE}>
        <ActionButton
          type="primary"
          actionType="navigate-link"
          text={t('sqlAudit.list.action.create')}
          icon={<PlusOutlined width={10} height={10} color="currentColor" />}
          link={{
            to: ROUTE_PATHS.SQLE.SQL_AUDIT.create,
            params: { projectID }
          }}
        />
      </PermissionControl>
    )
  };
};
