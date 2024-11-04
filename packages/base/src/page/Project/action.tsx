import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { t } from '../../locale';

export const ProjectManagementPageHeaderActions = (
  onExport: () => void,
  exportPending: boolean,
  onCreate: () => void
): Record<
  'batch_import_data_source' | 'import' | 'export' | 'create',
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
            to: '/project/batch-import'
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
            to: '/project/import'
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
    )
  };
};
