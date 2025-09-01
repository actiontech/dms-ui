import { t } from '../../../locale';
import { formatTime } from '@actiontech/dms-kit';
import { IListDBServiceSyncTask } from '@actiontech/shared/lib/api/base/service/common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicTag, BasicToolTip, DatabaseTypeLogo } from '@actiontech/dms-kit';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { Space } from 'antd';
export const SyncTaskListTableColumnFactory: () => ActiontechTableColumn<IListDBServiceSyncTask> =
  () => {
    const { getLogoUrlByDbType } = useDbServiceDriver();
    return [
      {
        dataIndex: 'name',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.name')
      },
      {
        dataIndex: 'source',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.source')
      },
      {
        dataIndex: 'url',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.url')
      },
      {
        dataIndex: 'db_type',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.instanceType'),
        render(type: string) {
          if (!type) {
            return '-';
          }
          return (
            <DatabaseTypeLogo
              dbType={type}
              logoUrl={getLogoUrlByDbType(type)}
            />
          );
        }
      },
      {
        dataIndex: 'last_sync_err',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.lastSyncResult'),
        render: (lastSyncErr, record) => {
          if (lastSyncErr) {
            return (
              <BasicToolTip title={lastSyncErr}>
                <BasicTag color="red">{t('common.fail')}</BasicTag>
              </BasicToolTip>
            );
          }
          if (!lastSyncErr && !!record.last_sync_success_time)
            return (
              <Space>
                <BasicTag color="green">{t('common.success')}</BasicTag>
              </Space>
            );
          return '-';
        }
      },
      {
        dataIndex: 'last_sync_success_time',
        title: () =>
          t('dmsSyncDataSource.syncTaskList.columns.lastSyncSuccessTime'),
        render: (time) => {
          return formatTime(time, '-');
        }
      }
    ];
  };
