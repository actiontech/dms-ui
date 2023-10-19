import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import DatabaseTypeLogo from 'sqle/src/components/DatabaseTypeLogo';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionMeta,
  ActiontechTableColumn
} from '@actiontech/shared/lib/components/ActiontechTable';
import { NavigateFunction } from 'react-router-dom';
import { BasicTag, BasicToolTips } from '@actiontech/shared';

export const SyncTaskListActions: (params: {
  navigate: NavigateFunction;
  syncAction: (taskId: string) => void;
  deleteAction: (taskId: string) => void;
  projectID: string;
  isArchive: boolean;
}) => ActiontechTableActionMeta<IListDatabaseSourceService>[] = ({
  navigate,
  syncAction,
  deleteAction,
  projectID,
  isArchive
}) => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      permissions: () => !isArchive,
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
      buttonProps: (record) => {
        return {
          onClick: () => syncAction(record?.uid ?? '')
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      permissions: () => !isArchive,
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

          return <DatabaseTypeLogo dbType={type} />;
        }
      },
      {
        dataIndex: 'last_sync_err',
        title: () => t('dmsSyncDataSource.syncTaskList.columns.lastSyncResult'),
        render: (lastSyncErr) => {
          return !lastSyncErr ? (
            <BasicTag color="green">{t('common.success')}</BasicTag>
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
          return formatTime(time);
        }
      }
    ];
  };
