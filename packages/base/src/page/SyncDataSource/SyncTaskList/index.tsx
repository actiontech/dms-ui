import { useRequest } from 'ahooks';
import { message, Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { SyncTaskListActions, SyncTaskListTableColumnFactory } from './column';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { Link, useNavigate } from 'react-router-dom';
import {
  ActiontechTable,
  TableRefreshButton,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { useMemo } from 'react';

const SyncTaskList: React.FC = () => {
  const { t } = useTranslation();
  const { projectID, projectArchive, projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const navigate = useNavigate();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [messageApi, contextHoler] = message.useMessage();

  const syncAction = (taskId: string) => {
    const hideLoading = messageApi.loading(
      t('dmsSyncDataSource.syncTaskList.syncTaskLoading')
    );
    dms
      .SyncDatabaseSourceService({
        database_source_service_uid: taskId,
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsSyncDataSource.syncTaskList.syncTaskSuccessTips')
          );
        }
      })
      .finally(() => {
        hideLoading();
        refresh();
      });
  };
  const deleteAction = (taskId: string) => {
    const hideLoading = messageApi.loading(
      t('dmsSyncDataSource.syncTaskList.deleteTaskLoading')
    );
    dms
      .DeleteDatabaseSourceService({
        database_source_service_uid: taskId,
        project_uid: projectID
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

  const { loading, data, refresh } = useRequest(
    () =>
      handleTableRequestError(
        dms.ListDatabaseSourceServices({
          project_uid: projectID
        })
      ),
    {
      ready: !!projectID
    }
  );

  return (
    <>
      {contextHoler}
      <PageHeader
        title={
          <Space>
            {t('dmsSyncDataSource.syncTaskList.title')}
            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={[
          <EmptyBox if={!projectArchive} key="addSyncTask">
            <Link to={`/project/${projectID}/syncDataSource/create`}>
              <BasicButton type="primary" icon={<IconAdd />}>
                {t('dmsSyncDataSource.syncTaskList.addSyncTask')}
              </BasicButton>
            </Link>
          </EmptyBox>
        ]}
      />

      <ActiontechTable
        errorMessage={requestErrorMessage}
        dataSource={data?.list}
        rowKey="uid"
        loading={loading}
        pagination={false}
        columns={SyncTaskListTableColumnFactory()}
        actions={SyncTaskListActions({
          navigate,
          syncAction,
          projectID,
          deleteAction,
          isArchive: projectArchive,
          actionPermission
        })}
      />
    </>
  );
};

export default SyncTaskList;
