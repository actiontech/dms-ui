import { t } from '../../locale';
import { Link } from 'react-router-dom';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { BasicButton } from '@actiontech/shared';

export const sqlAuditPageHeaderActions = (
  projectID: string
): Record<'create-audit' | 'create-optimization', React.ReactNode> => {
  return {
    'create-audit': (
      // <PermissionControl permission={PERMISSIONS.ACTIONS.SQLE.SQL_AUDIT.CREATE}>
      //   <ActionButton
      //     type="primary"
      //     actionType="navigate-link"
      //     text={t('sqlAudit.list.action.create')}
      //     icon={<PlusOutlined width={10} height={10} color="currentColor" />}
      //     link={{
      //       to: ROUTE_PATHS.SQLE.SQL_AUDIT.create,
      //       params: {
      //         projectID
      //       }
      //     }}
      //   />
      // </PermissionControl>
      <Link to={`/sqle/project/${projectID}/sqlAudit/create`}>
        <BasicButton icon={<IconAdd />} type="primary">
          {t('sqlAudit.list.action.create')}
        </BasicButton>
      </Link>
    ),
    'create-optimization': (
      // <ActionButton
      //   type="primary"
      //   actionType="navigate-link"
      //   text={t('sqlAudit.createOptimization')}
      //   icon={<PlusOutlined width={10} height={10} color="currentColor" />}
      //   link={{
      //     to: ROUTE_PATHS.SQLE.SQL_AUDIT.create_optimization,
      //     params: { projectID }
      //   }}
      // />
      <Link to={`/sqle/project/${projectID}/sqlAudit/create-optimization`}>
        <BasicButton icon={<IconAdd />} type="primary">
          {t('sqlAudit.createOptimization')}
        </BasicButton>
      </Link>
    )
  };
};
