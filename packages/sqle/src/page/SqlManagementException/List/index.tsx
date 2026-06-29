import { PageHeader, BasicButton, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { PlusOutlined } from '@actiontech/icons';
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
  TableFilterButton,
  useTableFilterContainer,
  SearchInput
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IGetBlacklistV1Params } from '@actiontech/shared/lib/api/sqle/service/blacklist/index.d';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  SqlManagementExceptionListColumns,
  SqlManagementExceptionListFilterMeta,
  SqlManagementExceptionTableFilterParamType,
  SqlManagementExceptionActions,
  SqlManagementExceptionFilterCustomProps
} from './column';
import { message, Space } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useSqlManagementExceptionRedux from '../hooks/useSqlManagementExceptionRedux';
import SqlManagementExceptionDetailDrawer from '../Detail';
import { useSearchParams } from 'react-router-dom';
import { RULE_EXCEPTION_DETAIL_QUERY_KEY } from '../../RuleException/index.data';

const SqlManagementExceptionList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [messageApi, messageContextHolder] = message.useMessage();
  const [detailBlacklistId, setDetailBlacklistId] = useState<number>();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

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
      refreshDeps: [pagination, tableFilterInfo, searchKeyword, projectName]
    }
  );

  const listColumns = useMemo(() => SqlManagementExceptionListColumns(), []);

  const filterCustomProps = useMemo(
    () => SqlManagementExceptionFilterCustomProps(),
    []
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(
      listColumns,
      updateTableFilterInfo,
      SqlManagementExceptionListFilterMeta()
    );

  const openDetailDrawer = useCallback((blacklistId?: number) => {
    if (!blacklistId) {
      return;
    }
    setDetailBlacklistId(blacklistId);
    setDetailDrawerOpen(true);
  }, []);

  const closeDetailDrawer = useCallback(() => {
    setDetailDrawerOpen(false);
    setDetailBlacklistId(undefined);
    if (searchParams.get(RULE_EXCEPTION_DETAIL_QUERY_KEY)) {
      searchParams.delete(RULE_EXCEPTION_DETAIL_QUERY_KEY);
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const onView = useCallback(
    (selectRow?: IBlacklistResV1) => {
      openDetailDrawer(selectRow?.blacklist_id);
    },
    [openDetailDrawer]
  );

  const onUpdate = useCallback(
    (selectRow?: IBlacklistResV1) => {
      closeDetailDrawer();
      updateSelectSqlManagementExceptionRecord(selectRow);
      dispatch(
        updateSqlManagementExceptModalStatus({
          modalName: ModalName.Update_Sql_Management_Exception,
          status: true
        })
      );
    },
    [closeDetailDrawer, dispatch, updateSelectSqlManagementExceptionRecord]
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

  useEffect(() => {
    const blacklistId = searchParams.get(RULE_EXCEPTION_DETAIL_QUERY_KEY);
    if (blacklistId) {
      openDetailDrawer(Number(blacklistId));
    }
  }, [openDetailDrawer, searchParams]);

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
        filterButton={false}
        searchInput={false}
        loading={loading}
      >
        <Space size={12} align="center" wrap>
          <SearchInput
            onChange={setSearchKeyword}
            onSearch={() => {
              refreshBySearchKeyword();
            }}
          />
          <TableFilterButton
            filterButtonMeta={filterButtonMeta}
            updateAllSelectedFilterItem={updateAllSelectedFilterItem}
            disabled={loading}
          />
          <TableFilterContainer
            filterContainerMeta={filterContainerMeta}
            updateTableFilterInfo={updateTableFilterInfo}
            disabled={loading}
            filterCustomProps={filterCustomProps}
            style={{
              borderBottom: 'none',
              padding: 0,
              backgroundColor: 'transparent'
            }}
          />
        </Space>
      </TableToolbar>
      <ActiontechTable
        dataSource={whitelistList?.list}
        rowKey={(record: IBlacklistResV1) => {
          return `${record?.blacklist_id}`;
        }}
        pagination={{
          total: whitelistList?.total ?? 0
        }}
        columns={listColumns}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={SqlManagementExceptionActions(
          onView,
          onUpdate,
          onDelete,
          actionPermission && !projectArchive
        )}
      />
      <SqlManagementExceptionModal />
      <SqlManagementExceptionDetailDrawer
        open={detailDrawerOpen}
        blacklistId={detailBlacklistId}
        onClose={closeDetailDrawer}
        onEdit={onUpdate}
        onDeleted={refresh}
      />
    </>
  );
};

export default SqlManagementExceptionList;
