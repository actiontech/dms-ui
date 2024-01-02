import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
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
  projectID: string;
  isArchive: boolean;
  actionPermission: boolean;
}) => ActiontechTableActionMeta<IListDatabaseSourceService>[] = ({
  navigate,
  syncAction,
  deleteAction,
  projectID,
  isArchive,
  actionPermission
}) => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      permissions: () => !isArchive && actionPermission,
      buttonProps: (record) => {
        return {
          onClick: () =>
            navigate(
              `/project/${projectID}/syncDataSource/update/${record?.uid ?? ''}`
            )
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
      permissions: () => !isArchive && actionPermission,
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

export const SyncTaskListTableColumnFactory: () => ActiontechTableColumn<IListDatabaseSourceService> =
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
        dataIndex: 'version',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.version')
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
            return '--';
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
        render: (lastSyncErr) => {
          return !lastSyncErr ? (
            <Space>
              <BasicTag color="green">{t('common.success')}</BasicTag>
            </Space>
          ) : (
            <BasicToolTips title={lastSyncErr}>
              <BasicTag color="red">{t('common.fail')}</BasicTag>
            </BasicToolTips>
          );
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
