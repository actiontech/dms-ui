import { PlusOutlined } from '@actiontech/icons';
import { ActionButton } from '@actiontech/shared';
import { PermissionControl, PERMISSIONS } from '@actiontech/shared/lib/global';
import { ReactNode } from 'react';
import { DataSourceManagerSegmentedKey } from './index.type';
import { t } from '../../locale';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

export const DataSourceManagementPageHeaderActions = (
  activeKey: DataSourceManagerSegmentedKey,
  onBatchTestConnection: () => void
): Record<
  | 'add_sync_task'
  | 'batch_import_db_service'
  | 'add_db_service'
  | 'batch_test_data_source_connection',
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
          link={{ to: ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.create }}
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
          link={{ to: ROUTE_PATHS.BASE.GLOBAL_DATA_SOURCE.batch_import }}
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
          link={{ to: ROUTE_PATHS.BASE.GLOBAL_DATA_SOURCE.create }}
        />
      </PermissionControl>
    ),
    batch_test_data_source_connection: (
      <PermissionControl
        permission={
          PERMISSIONS.ACTIONS.BASE.GLOBAL_DATA_SOURCE.BATCH_TEST_CONNECT
        }
      >
        <ActionButton
          onClick={onBatchTestConnection}
          hidden={activeKey !== DataSourceManagerSegmentedKey.GlobalDataSource}
          text={t('dmsGlobalDataSource.batchTestDataSourceConnection')}
        />
      </PermissionControl>
    )
  };
};
