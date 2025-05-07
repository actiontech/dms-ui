import { ActionButton } from '@actiontech/shared';
import {
  PERMISSIONS,
  PermissionControl
} from '@actiontech/shared/lib/features';
import { ReactNode } from 'react';
import { t } from '../../locale';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const ProjectManagementPageHeaderActions = (
  onExport: () => void,
  exportPending: boolean,
  onCreate: () => void
): Record<
  | 'batch_import_data_source'
  | 'import'
  | 'export'
  | 'create'
  | 'global_resource_overview'
  | 'configure_availability_zone',
  ReactNode
> => {
  return {
    batch_import_data_source: (
      <PermissionControl
        permission={
          PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.BATCH_IMPORT_DATA_SOURCE
        }
      >
        <ActionButton
          actionType="navigate-link"
          text={t('dmsProject.batchImportDataSource.buttonText')}
          link={{
            to: ROUTE_PATHS.BASE.PROJECT.batch_import
          }}
        />
      </PermissionControl>
    ),
    export: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.EXPORT}
      >
        <ActionButton
          disabled={exportPending}
          text={t('dmsProject.exportProject.buttonText')}
          onClick={onExport}
        />
      </PermissionControl>
    ),
    import: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.IMPORT}
      >
        <ActionButton
          actionType="navigate-link"
          text={t('dmsProject.importProject.buttonText')}
          link={{
            to: ROUTE_PATHS.BASE.PROJECT.import
          }}
        />
      </PermissionControl>
    ),
    create: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.CREATE}
      >
        <ActionButton
          type="primary"
          text={t('dmsProject.createProject.modalTitle')}
          onClick={onCreate}
        />
      </PermissionControl>
    ),
    global_resource_overview: (
      <PermissionControl
        permission={
          PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.GLOBAL_RESOURCE_OVERVIEW
        }
      >
        <ActionButton
          actionType="navigate-link"
          text={t('dmsProject.resourceOverview')}
          link={{
            to: ROUTE_PATHS.BASE.RESOURCE_OVERVIEW
          }}
        />
      </PermissionControl>
    ),
    configure_availability_zone: (
      <PermissionControl
        permission={
          PERMISSIONS.ACTIONS.BASE.PROJECT_MANAGER.CONFIGURE_AVAILABILITY_ZONE
        }
      >
        <ActionButton
          actionType="navigate-link"
          text={t('dmsProject.availabilityZone')}
          link={{
            to: ROUTE_PATHS.BASE.AVAILABILITY_ZONE
          }}
        />
      </PermissionControl>
    )
  };
};
