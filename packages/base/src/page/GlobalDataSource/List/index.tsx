import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import { TestConnectDisableReasonStyleWrapper } from '@actiontech/shared/lib/components/TestDatabaseConnectButton/style';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
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
import { IListGlobalDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  GlobalDataSourceColumns,
  GLobalDataSourceListParamType
} from './columns';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import useProjectTips from '../../../hooks/useProjectTips';
import useGlobalDataSourceType from '../hooks/useGlobalDataSourceType';
import usePermission from '@actiontech/shared/lib/global/usePermission/usePermission';
import { GlobalDataSourceListActions } from './action';

const GlobalDataSourceList = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { parse2TableActionPermissions } = usePermission();

  const [modalApi, modalContextHolder] = Modal.useModal();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { getLogoUrlByDbType, updateDriverList } = useDbServiceDriver();

  const {
    updateDbTypeList,
    dbTypeOptions,
    loading: getDbTypeListLoading
  } = useGlobalDataSourceType();

  const {
    projectIDOptions,
    updateProjects,
    loading: getProjectsLoading
  } = useProjectTips();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    refreshBySearchKeyword,
    searchKeyword,
    setSearchKeyword
  } = useTableRequestParams<
    IListGlobalDBService,
    GLobalDataSourceListParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: dataSourceList,
    loading,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        DBService.ListGlobalDBServices({
          ...tableFilterInfo,
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          fuzzy_keyword: searchKeyword
        })
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const columns = useMemo(
    () => GlobalDataSourceColumns(getLogoUrlByDbType),
    [getLogoUrlByDbType]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListGlobalDBService, FilterCustomProps>([
      ['db_type', { options: dbTypeOptions, loading: getDbTypeListLoading }],
      [
        'project_name',
        { options: projectIDOptions, loading: getProjectsLoading }
      ]
    ]);
  }, [
    dbTypeOptions,
    getDbTypeListLoading,
    projectIDOptions,
    getProjectsLoading
  ]);

  const actions = useMemo(() => {
    const navigateToUpdatePage = (dbServiceUid: string, projectID: string) => {
      navigate(`/project/${projectID}/db-services/update/${dbServiceUid}`);
    };

    const deleteDatabase = (
      dbServiceUid: string,
      dvServiceName: string,
      projectID: string
    ) => {
      const hideLoading = messageApi.loading(
        t('dmsGlobalDataSource.deleteDatabase.deletingDatabase', {
          name: dvServiceName
        }),
        0
      );
      DBService.DelDBService({
        db_service_uid: dbServiceUid,
        project_uid: projectID
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('dmsGlobalDataSource.deleteDatabase.deleteSuccessTips', {
                name: dvServiceName
              })
            );
            refresh();
          }
        })
        .finally(() => {
          hideLoading();
        });
    };

    const testDatabaseConnection = (
      dbServiceUid: string,
      dbServiceName: string,
      projectID: string
    ) => {
      const hide = messageApi.loading(
        t('common.testDatabaseConnectButton.testing'),
        0
      );
      DBService.CheckDBServiceIsConnectableById({
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
                title: t('dmsGlobalDataSource.testConnectModal.errorTitle', {
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
    };
    return parse2TableActionPermissions(
      GlobalDataSourceListActions(
        navigateToUpdatePage,
        deleteDatabase,
        testDatabaseConnection
      )
    );
  }, [
    parse2TableActionPermissions,
    navigate,
    messageApi,
    t,
    refresh,
    modalApi
  ]);

  useEffect(() => {
    updateDriverList();
    updateProjects();
    updateDbTypeList();
  }, [updateDbTypeList, updateDriverList, updateProjects]);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Global_Data_Source,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <TableToolbar
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
        rowKey={(record: IListGlobalDBService) => {
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

export default GlobalDataSourceList;
