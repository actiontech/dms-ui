import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { message, Modal, Space } from 'antd';
import { PageHeader } from '@actiontech/dms-kit';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';
import { TestConnectDisableReasonStyleWrapper } from '@actiontech/dms-kit/es/components/TestDatabaseConnectButton/style';
import {
  useCurrentProject,
  useDbServiceDriver,
  usePermission
} from '@actiontech/shared/lib/features';
import useDbService from '../../../../hooks/useDbService';
import { useBoolean, useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/dms-kit';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar,
  TableFilterContainer
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import {
  DataMaskingFilterTypeEnum,
  DataSourceColumns,
  DataSourceListParamType,
  filterDataMaskOptions
} from './columns';
import { DataSourceListActions, DataSourcePageHeaderActions } from './actions';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import useStaticTips from '../../../../hooks/useStaticTips';
import { DmsApi } from '@actiontech/shared/lib/api';
import useServiceEnvironment from 'sqle/src/hooks/useServiceEnvironment';
import {
  getDBServiceConnectableErrorMessage,
  getDbServiceIsConnectbale
} from '../../../../utils/common';
const DataSourceList = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const extractQuery = useTypedQuery();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { parse2TableActionPermissions } = usePermission();
  const { projectID } = useCurrentProject();
  const [
    batchTestDatabaseConnectionPending,
    { setFalse: finishTestConnection, setTrue: startTestConnection }
  ] = useBoolean();
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
    environmentOptions,
    loading: getEnvironmentListLoading,
    updateEnvironmentList
  } = useServiceEnvironment();
  const { generateDatabaseTestConnectionStatusSelectOptions } = useStaticTips();
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    refreshBySearchKeyword,
    searchKeyword,
    setSearchKeyword
  } = useTableRequestParams<IListDBServiceV2, DataSourceListParamType>({
    defaultSearchKeyword:
      extractQuery(ROUTE_PATHS.BASE.DATA_SOURCE.index)?.address || ''
  });
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const createEnableMaskingParams = (
    params: DataSourceListParamType,
    enableMasking: DataMaskingFilterTypeEnum
  ) => {
    if (!enableMasking) return;
    params.is_enable_masking =
      enableMasking === DataMaskingFilterTypeEnum.checked;
  };
  const {
    data: dataSourceList,
    loading,
    refresh
  } = useRequest(
    () => {
      createEnableMaskingParams(
        tableFilterInfo,
        tableFilterInfo.is_enable_masking as unknown as DataMaskingFilterTypeEnum
      );
      return handleTableRequestError(
        DmsApi.DBServiceService.ListDBServicesV2({
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
      navigate(ROUTE_PATHS.BASE.DATA_SOURCE.update, {
        params: {
          projectID,
          dbServiceUid
        }
      });
    },
    [navigate, projectID]
  );
  const navigateToSqlManagementConf = useCallback(
    (uid: string, environment: string, instanceAuditPlanId?: string) => {
      if (instanceAuditPlanId) {
        navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update, {
          params: {
            projectID,
            id: instanceAuditPlanId
          }
        });
      } else {
        navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.create, {
          params: {
            projectID
          },
          queries: {
            instance_id: uid,
            environment_tag: environment
          }
        });
      }
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
      DmsApi.DBServiceService.DelDBService({
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
      DmsApi.DBServiceService.CheckDBServiceIsConnectableById({
        db_service_uid: dbServiceUid,
        project_uid: projectID
      })
        .then((res) => {
          hide();
          if (res.data.code === ResponseCode.SUCCESS) {
            refresh();
            const connections = res.data.data ?? [];
            const isConnectable = getDbServiceIsConnectbale(connections);
            const connectErrorMessage =
              getDBServiceConnectableErrorMessage(connections);
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
    [messageApi, modalApi, projectID, refresh, t]
  );
  const batchTestDatabaseConnection = () => {
    if (!dataSourceList?.list || dataSourceList.list.length === 0) {
      messageApi.error(t('dmsDataSource.batchTestConnection.notFoundData'));
      return;
    }
    startTestConnection();
    DmsApi.DBServiceService.CheckProjectDBServicesConnections({
      project_uid: projectID,
      db_services:
        dataSourceList?.list?.map((v) => ({
          db_service_uid: v.uid!
        })) ?? []
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          messageApi.success(
            t(
              'dmsDataSource.batchTestConnection.batchTestConnectionSuccessTips'
            )
          );
        }
      })
      .finally(() => {
        finishTestConnection();
      });
  };
  const columns = useMemo(
    () => DataSourceColumns(getLogoUrlByDbType),
    [getLogoUrlByDbType]
  );
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);
  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListDBServiceV2, FilterCustomProps>([
      [
        'name',
        {
          options: dbServiceOptions,
          loading: getDbServiceOptionsLoading
        }
      ],
      [
        'db_type',
        {
          options: dbDriverOptions,
          loading: getDriveOptionsLoading
        }
      ],
      [
        'last_connection_test_status',
        {
          options: generateDatabaseTestConnectionStatusSelectOptions
        }
      ],
      [
        'environment_tag',
        {
          options: environmentOptions,
          loading: getEnvironmentListLoading
        }
      ],
      // #if [dms]
      [
        'is_enable_masking',
        {
          options: filterDataMaskOptions
        }
      ]
      // #endif
    ]);
  }, [
    dbDriverOptions,
    dbServiceOptions,
    generateDatabaseTestConnectionStatusSelectOptions,
    getDbServiceOptionsLoading,
    getDriveOptionsLoading,
    environmentOptions,
    getEnvironmentListLoading
  ]);
  const tableActions = useMemo(() => {
    return parse2TableActionPermissions(
      DataSourceListActions(
        navigateToUpdatePage,
        deleteDatabase,
        testDatabaseConnection,
        navigateToSqlManagementConf
      )
    );
  }, [
    parse2TableActionPermissions,
    navigateToUpdatePage,
    deleteDatabase,
    testDatabaseConnection,
    navigateToSqlManagementConf
  ]);
  const pageHeaderActions = DataSourcePageHeaderActions(
    projectID,
    batchTestDatabaseConnection,
    batchTestDatabaseConnectionPending
  );
  useEffect(() => {
    if (projectID) {
      updateDriverList();
      updateDbServiceList({
        project_uid: projectID
      });
      updateEnvironmentList(projectID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectID]);
  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <PageHeader
        title={t('dmsDataSource.databaseListTitle')}
        extra={
          <Space>
            {pageHeaderActions['batch-test-data-source-connection']}
            {/* #if [ee] */}
            {pageHeaderActions['batch-import-data-source']}
            {/* #endif */}
            {pageHeaderActions['add-data-source']}
          </Space>
        }
      />
      <TableToolbar
        refreshButton={{
          refresh,
          disabled: loading
        }}
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
        rowKey={(record: IListDBServiceV2) => {
          return `${record?.uid}`;
        }}
        pagination={{
          total: dataSourceList?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={columns}
        actions={tableActions}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </>
  );
};
export default DataSourceList;
