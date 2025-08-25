import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { SyncTaskListTableColumnFactory } from './column';
import { ResponseCode } from '@actiontech/dms-kit';
import DBServiceSyncTaskService from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect } from 'react';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { SyncTaskListActions } from './action';
import { usePermission } from '@actiontech/shared/lib/features';

const SyncTaskList: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHoler] = message.useMessage();

  const { parse2TableActionPermissions } = usePermission();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const syncAction = (taskId: string) => {
    const hideLoading = messageApi.loading(
      t('dmsSyncDataSource.syncTaskList.syncTaskLoading')
    );
    DBServiceSyncTaskService.SyncDBServices({
      db_service_sync_task_uid: taskId
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsSyncDataSource.syncTaskList.syncTaskSuccessTips'),
            3,
            () => {
              refresh();
            }
          );
        }
      })
      .finally(() => {
        hideLoading();
      });
  };
  const deleteAction = (taskId: string) => {
    const hideLoading = messageApi.loading(
      t('dmsSyncDataSource.syncTaskList.deleteTaskLoading')
    );
    DBServiceSyncTaskService.DeleteDBServiceSyncTask({
      db_service_sync_task_uid: taskId
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsSyncDataSource.syncTaskList.deleteTaskSuccessTips')
          );
          refresh();
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const { loading, data, refresh } = useRequest(() =>
    handleTableRequestError(DBServiceSyncTaskService.ListDBServiceSyncTasks())
  );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Sync_Data_Source,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  return (
    <>
      {contextHoler}

      <ActiontechTable
        errorMessage={requestErrorMessage}
        dataSource={data?.list}
        rowKey="uid"
        loading={loading}
        pagination={false}
        columns={SyncTaskListTableColumnFactory()}
        actions={parse2TableActionPermissions(
          SyncTaskListActions({
            syncAction,
            deleteAction
          })
        )}
      />
    </>
  );
};

export default SyncTaskList;
