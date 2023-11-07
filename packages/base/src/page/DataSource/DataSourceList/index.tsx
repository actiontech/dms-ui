import { useRequest } from 'ahooks';
import { message, Modal, Space } from 'antd5';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSourceColumns, DataSourceListActions } from './columns';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  ActiontechTable,
  TableRefreshButton,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { TestConnectDisableReasonStyleWrapper } from '@actiontech/shared/lib/components/TestDatabaseConnectButton/style';

const DataSourceList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectID, projectArchive, projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const { tableChange, pagination } = useTableRequestParams<IListDBService>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    data: dataSourceList,
    loading,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        dms.ListDBServices({
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          project_uid: projectID
        })
      );
    },
    {
      refreshDeps: [pagination],
      ready: !!projectID
    }
  );

  const navigateToUpdatePage = useCallback(
    (dbServiceUid: string) => {
      navigate(`/project/${projectID}/db-services/update/${dbServiceUid}`);
    },
    [navigate, projectID]
  );

  const deleteDatabase = useCallback(
    (dbServiceUid: string, dvServiceName: string) => {
      const hideLoading = messageApi.loading(
        t('dmsDataSource.deleteDatabase.deletingDatabase', {
          name: dvServiceName
        }),
        0
      );
      dms
        .DelDBService({
          db_service_uid: dbServiceUid,
          project_uid: projectID
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('dmsDataSource.deleteDatabase.deleteSuccessTips', {
                name: dvServiceName
              })
            );
            refresh();
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [messageApi, refresh, t, projectID]
  );

  const testDatabaseConnection = useCallback(
    (dbServiceUid: string, dbServiceName: string) => {
      const hide = messageApi.loading(
        t('common.testDatabaseConnectButton.testing'),
        0
      );
      dms
        .CheckDBServiceIsConnectableById({
          db_service_uid: dbServiceUid,
          project_uid: projectID
        })
        .then((res) => {
          hide();
          if (res.data.code === ResponseCode.SUCCESS) {
            const connections = res.data.data ?? [];
            const isConnectable = connections.every(
              (connection) => !!connection?.is_connectable
            );
            const connectErrorMessage = connections.reduce(
              (acc, cur, curIndex) =>
                !!cur?.is_connectable
                  ? acc
                  : acc +
                    `${cur.component}: ${cur?.connect_error_message?.replace(
                      /\n$/,
                      ''
                    )} ${curIndex < connections.length - 1 ? '\n\r' : ''}`,
              ''
            );
            if (isConnectable) {
              messageApi.success(
                t('common.testDatabaseConnectButton.testSuccess')
              );
            } else {
              modalApi.error({
                title: t('dmsDataSource.testConnectModal.errorTitle', {
                  dbServiceName
                }),
                content: (
                  <TestConnectDisableReasonStyleWrapper>
                    {connectErrorMessage ?? t('common.unknownError')}
                  </TestConnectDisableReasonStyleWrapper>
                )
              });
            }
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, modalApi, projectID, t]
  );

  const columns = useMemo(() => DataSourceColumns(), []);

  const actions = useMemo(() => {
    return DataSourceListActions(
      navigateToUpdatePage,
      deleteDatabase,
      testDatabaseConnection,
      projectArchive,
      actionPermission
    );
  }, [
    navigateToUpdatePage,
    deleteDatabase,
    testDatabaseConnection,
    projectArchive,
    actionPermission
  ]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageHeader
        title={
          <Space>
            {t('dmsDataSource.databaseListTitle')}
            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={[
          <EmptyBox
            if={!projectArchive && actionPermission}
            key="add-dataSource"
          >
            <Link to={`/project/${projectID}/db-services/create`}>
              <BasicButton type="primary" icon={<IconAdd />}>
                {t('dmsDataSource.addDatabase')}
              </BasicButton>
            </Link>
          </EmptyBox>
        ]}
      />
      <ActiontechTable
        dataSource={dataSourceList?.list}
        rowKey={(record: IListDBService) => {
          return `${record?.uid}`;
        }}
        pagination={{
          total: dataSourceList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        actions={actions}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};

export default DataSourceList;
