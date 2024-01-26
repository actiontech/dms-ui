import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { message, Modal } from 'antd';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon';
import { TestConnectDisableReasonStyleWrapper } from '@actiontech/shared/lib/components/TestDatabaseConnectButton/style';
import {
  useCurrentProject,
  useCurrentUser,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import useDbService from '../../../../hooks/useDbService';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar,
  TableFilterContainer
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  DataSourceColumns,
  DataSourceListActions,
  DataSourceListParamType
} from './columns';

const DataSourceList = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID, projectArchive, projectName } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const {
    dbDriverOptions,
    getLogoUrlByDbType,
    loading: getDriveOptionsLoading,
    updateDriverList
  } = useDbServiceDriver();
  const {
    dbServiceOptions,
    loading: getDbServiceOptionsLoading,
    updateDbServiceList
  } = useDbService();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    refreshBySearchKeyword,
    searchKeyword,
    setSearchKeyword
  } = useTableRequestParams<IListDBService, DataSourceListParamType>({
    defaultSearchKeyword: searchParams.get('address') || ''
  });
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
          ...tableFilterInfo,
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          project_uid: projectID,
          fuzzy_keyword: searchKeyword
        })
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo],
      ready: !!projectID
    }
  );

  const navigateToUpdatePage = useCallback(
    (dbServiceUid: string) => {
      navigate(`/project/${projectID}/db-services/update/${dbServiceUid}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectID]
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

  const columns = useMemo(
    () => DataSourceColumns(getLogoUrlByDbType),
    [getLogoUrlByDbType]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDBService, FilterCustomProps>([
      [
        'name',
        { options: dbServiceOptions, loading: getDbServiceOptionsLoading }
      ],
      ['db_type', { options: dbDriverOptions, loading: getDriveOptionsLoading }]
    ]);
  }, [
    dbDriverOptions,
    dbServiceOptions,
    getDbServiceOptionsLoading,
    getDriveOptionsLoading
  ]);

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

  useEffect(() => {
    if (projectID) {
      updateDriverList();
      updateDbServiceList({ project_uid: projectID });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectID]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageHeader
        title={t('dmsDataSource.databaseListTitle')}
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
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          defaultValue: searchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        dataSource={dataSourceList?.list}
        rowKey={(record: IListDBService) => {
          return `${record?.uid}`;
        }}
        pagination={{
          total: dataSourceList?.total ?? 0,
          current: pagination.page_index
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
