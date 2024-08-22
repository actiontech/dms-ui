import { PageHeader, BasicButton, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useMemo, useEffect } from 'react';
import { PlusOutlined } from '@actiontech/icons';
import { useCallback } from 'react';
import { updateSqlManagementExceptModalStatus } from '../../../store/sqlManagementException';
import { ModalName } from '../../../data/ModalName';
import SqlManagementExceptionModal from '../Modal';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterContainer,
  useTableFilterContainer,
  FilterCustomProps
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetBlacklistV1Params } from '@actiontech/shared/lib/api/sqle/service/blacklist/index.d';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  SqlManagementExceptionListColumns,
  SqlManagementExceptionTableFilterParamType,
  SqlManagementExceptionActions
} from './column';
import { SqlManagementExceptionMatchTypeOptions } from '../index.data';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useSqlManagementExceptionRedux from '../hooks/useSqlManagementExceptionRedux';

const SqlManagementExceptionList = () => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectName, projectArchive } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const {
    openCreateSqlManagementExceptionModal,
    updateSelectSqlManagementExceptionRecord,
    dispatch
  } = useSqlManagementExceptionRedux();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IBlacklistResV1,
    SqlManagementExceptionTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: whitelistList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetBlacklistV1Params = {
        ...tableFilterInfo,
        page_index: String(pagination.page_index),
        page_size: String(pagination.page_size),
        project_name: projectName,
        fuzzy_search_content: searchKeyword
      };

      return handleTableRequestError(blacklist.getBlacklistV1(params));
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IBlacklistResV1, FilterCustomProps>([
      ['type', { options: SqlManagementExceptionMatchTypeOptions }]
    ]);
  }, []);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(
      SqlManagementExceptionListColumns(),
      updateTableFilterInfo
    );

  const onUpdate = useCallback(
    (selectRow?: IBlacklistResV1) => {
      updateSelectSqlManagementExceptionRecord(selectRow);
      dispatch(
        updateSqlManagementExceptModalStatus({
          modalName: ModalName.Update_Sql_Management_Exception,
          status: true
        })
      );
    },
    [dispatch, updateSelectSqlManagementExceptionRecord]
  );

  const onDelete = useCallback(
    (id?: number) => {
      const hide = messageApi.loading(
        t('sqlManagementException.operate.deleting')
      );
      blacklist
        .deleteBlackList({
          blacklist_id: `${id}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('sqlManagementException.operate.deleteSuccess')
            );
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refresh, t]
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Sql_management_Exception_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('sqlManagementException.pageTitle')}
        extra={
          <EmptyBox if={actionPermission && !projectArchive}>
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
              onClick={openCreateSqlManagementExceptionModal}
            >
              {t('sqlManagementException.operate.add')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
        loading={loading}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        dataSource={whitelistList?.list}
        rowKey={(record: IBlacklistResV1) => {
          return `${record?.blacklist_id}`;
        }}
        pagination={{
          total: whitelistList?.total ?? 0
        }}
        columns={SqlManagementExceptionListColumns()}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={SqlManagementExceptionActions(onUpdate, onDelete)}
      />
      <SqlManagementExceptionModal />
    </>
  );
};

export default SqlManagementExceptionList;
