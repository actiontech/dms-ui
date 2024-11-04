import { IListDBServiceSyncTask } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableActionsWithPermissions,
  PERMISSIONS
} from '@actiontech/shared/lib/global';
import { t } from '../../../locale';

export const SyncTaskListActions: (params: {
  syncAction: (taskId: string) => void;
  deleteAction: (taskId: string) => void;
}) => ActiontechTableActionsWithPermissions<IListDBServiceSyncTask> = ({
  syncAction,
  deleteAction
}) => {
  return [
    {
      key: 'edit',
      text: t('common.edit'),
      permissions: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.EDIT,
      link(record) {
        return {
          to: `/sync-data-source/update/${record?.uid ?? ''}`
        };
      }
    },
    {
      key: 'sync',
      text: t('dmsSyncDataSource.syncTaskList.columns.sync'),
      permissions: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.SYNC,
      buttonProps: (record) => {
        return {
          onClick: () => syncAction(record?.uid ?? '')
        };
      }
    },
    {
      key: 'delete',
      text: t('common.delete'),
      permissions: PERMISSIONS.ACTIONS.BASE.SYNC_DATA_SOURCE.DELETE,
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
