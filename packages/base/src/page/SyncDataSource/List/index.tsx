import { useRequest } from 'ahooks';
import { message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { SyncTaskListActions, SyncTaskListTableColumnFactory } from './column';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import DatabaseSourceService from '@actiontech/shared/lib/api/base/service/DatabaseSourceService';
import { Link, useNavigate } from 'react-router-dom';
import {
  ActiontechTable,
  TableRefreshButton,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useMemo } from 'react';
import { PlusOutlined } from '@actiontech/icons';

const SyncTaskList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHoler] = message.useMessage();

  const { projectID, projectArchive, projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const syncAction = (taskId: string) => {
    const hideLoading = messageApi.loading(
      t('dmsSyncDataSource.syncTaskList.syncTaskLoading')
    );
    DatabaseSourceService.SyncDatabaseSourceService({
      database_source_service_uid: taskId,
      project_uid: projectID
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
    DatabaseSourceService.DeleteDatabaseSourceService({
      database_source_service_uid: taskId,
      project_uid: projectID
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsSyncDataSource.syncTaskList.deleteTaskSuccessTips'),
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

  const { loading, data, refresh } = useRequest(
    () =>
      handleTableRequestError(
        DatabaseSourceService.ListDatabaseSourceServices({
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
          <EmptyBox if={!projectArchive && actionPermission} key="addSyncTask">
            <Link to={`/project/${projectID}/sync-data-source/create`}>
              <BasicButton
                type="primary"
                icon={
                  <PlusOutlined
                    width={10}
                    height={10}
                    fill="currentColor"
                    color="currentColor"
                  />
                }
              >
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
