import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { t } from '../../locale';
import { PlusOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { SqlAuditSegmentedKey } from './index.type';

export const sqlAuditPageHeaderActions = (
  projectID: string,
  activeKey = SqlAuditSegmentedKey.SqlAudit
): Record<'create-audit' | 'create-optimization', React.ReactNode> => {
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
          hidden={activeKey !== SqlAuditSegmentedKey.SqlAudit}
        />
      </PermissionControl>
    ),
    'create-optimization': (
      <PermissionControl permission={PERMISSIONS.ACTIONS.SQLE.SQL_AUDIT.CREATE}>
        <ActionButton
          type="primary"
          actionType="navigate-link"
          text={t('sqlAudit.createOptimization')}
          icon={<PlusOutlined width={10} height={10} color="currentColor" />}
          link={{
            to: ROUTE_PATHS.SQLE.SQL_AUDIT.create_optimization,
            params: { projectID }
          }}
          hidden={activeKey !== SqlAuditSegmentedKey.SqlOptimization}
        />
      </PermissionControl>
    )
  };
};
