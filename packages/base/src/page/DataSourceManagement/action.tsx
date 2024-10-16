import { PlusOutlined } from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';
import { PermissionControl, PERMISSIONS } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { DataSourceManagerSegmentedKey } from './index.type';
import { t } from '../../locale';

export const DataSourceManagementPageHeaderActions = (
  activeKey: DataSourceManagerSegmentedKey
): Record<
  'add_sync_task' | 'batch_import_db_service' | 'add_db_service',
  ReactNode
> => {
  return {
    add_sync_task: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.ADD}
      >
        <ActionButton
          text={t('dmsSyncDataSource.syncTaskList.addSyncTask')}
          type="primary"
          icon={<PlusOutlined width={10} height={10} color="currentColor" />}
          hidden={activeKey !== DataSourceManagerSegmentedKey.SyncDataSource}
          actionType="navigate-link"
          link={{ to: `/sync-data-source/create` }}
        />
      </PermissionControl>
    ),
    batch_import_db_service: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.BATCH_IMPORT}
      >
        <ActionButton
          text={t('dmsGlobalDataSource.batchImportDataSource.buttonText')}
          hidden={activeKey !== DataSourceManagerSegmentedKey.GlobalDataSource}
          actionType="navigate-link"
          link={{ to: `/global-data-source/batch-import` }}
        />
      </PermissionControl>
    ),
    add_db_service: (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.ADD}
      >
        <ActionButton
          text={t('dmsGlobalDataSource.addDatabase')}
          type="primary"
          icon={<PlusOutlined width={10} height={10} color="currentColor" />}
          hidden={activeKey !== DataSourceManagerSegmentedKey.GlobalDataSource}
          actionType="navigate-link"
          link={{ to: `/global-data-source/create` }}
        />
      </PermissionControl>
    )
  };
};
