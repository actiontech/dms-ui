import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IListDBServiceSyncTask } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { NavigateFunction } from 'react-router-dom';
import { BasicTag, BasicToolTips, DatabaseTypeLogo } from '@actiontech/shared';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { Space } from 'antd';

export const SyncTaskListActions: (params: {
  navigate: NavigateFunction;
  syncAction: (taskId: string) => void;
  deleteAction: (taskId: string) => void;
  actionPermission: boolean;
}) => ActiontechTableActionMeta<IListDBServiceSyncTask>[] = ({
  navigate,
  syncAction,
  deleteAction,
  actionPermission
}) => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      permissions: () => actionPermission,
      buttonProps: (record) => {
        return {
          onClick: () =>
            navigate(`/sync-data-source/update/${record?.uid ?? ''}`)
        };
      }
    },
    {
      key: 'sync',
      text: t('dmsSyncDataSource.syncTaskList.columns.sync'),
      permissions: () => actionPermission,
      buttonProps: (record) => {
        return {
          onClick: () => syncAction(record?.uid ?? '')
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      permissions: () => actionPermission,
      buttonProps: () => {
        return {
          danger: true
        };
      },
      confirm: (record) => {
        return {
          title: t('dmsSyncDataSource.syncTaskList.columns.deleteConfirmTitle'),
          onConfirm: () => deleteAction(record?.uid ?? '')
        };
      }
    }
  ];
};

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
              <BasicToolTips title={lastSyncErr}>
                <BasicTag color="red">{t('common.fail')}</BasicTag>
              </BasicToolTips>
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
