import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { WhitelistColumn, AuditWhitelistTableRow } from './columns';
import { ModalName } from '../../../data/ModalName';
import { message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  openWhitelistDetailDrawer,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  BasicButton,
  BasicToolTips,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import WhitelistDrawer from '../Drawer';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditWhitelistService from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterButton,
  SearchInput
} from '@actiontech/shared/lib/components/ActiontechTable';
import { DownArrowLineOutlined, PlusOutlined } from '@actiontech/icons';
import useWhitelistRedux from '../hooks/useWhitelistRedux';
import { useBoolean } from 'ahooks';
import AuditWhitelistListFilter from './ListFilter';
import {
  AuditWhitelistListFilterValues,
  buildAuditWhitelistExportParams,
  buildAuditWhitelistListParams
} from './buildAuditWhitelistListParams';
import { AUDIT_WHITELIST_DETAIL_QUERY_KEY } from '../index.data';
import { Space } from 'antd';
import { ActiontechTableActionMeta } from '@actiontech/shared/lib/components/ActiontechTable';

const EMPTY_FILTER_VALUES: AuditWhitelistListFilterValues = {};

const WhitelistList = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [listFilters, setListFilters] =
    useState<AuditWhitelistListFilterValues>(EMPTY_FILTER_VALUES);

  const { projectName } = useCurrentProject();

  const {
    dispatch,
    updateSelectWhitelistRecord,
    openCreateWhitelistModal,
    actionPermission
  } = useWhitelistRedux();

  const {
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<AuditWhitelistTableRow, Record<string, never>>();

  const [
    filterExpanded,
    { setTrue: expandFilters, setFalse: collapseFilters }
  ] = useBoolean(false);

  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);

  const columns = useMemo(() => WhitelistColumn(), []);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  // 导出沿用「查看」权：能解析当前项目且列表未 403/Forbidden 时展示；
  // 勿用 actionPermission（添加权）门控。无项目访问或列表拒绝时隐藏可用入口（AC-7）。
  const exportVisible = useMemo(
    () => !!projectName && !/403|Forbidden/i.test(requestErrorMessage),
    [projectName, requestErrorMessage]
  );

  const {
    data: whitelistList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params = buildAuditWhitelistListParams({
        projectName,
        pageIndex: pagination.page_index,
        pageSize: pagination.page_size,
        globalSearchKeyword: searchKeyword,
        filters: listFilters
      });

      return handleTableRequestError(
        AuditWhitelistService.getAuditWhitelistV1(params)
      );
    },
    {
      refreshDeps: [pagination, searchKeyword, listFilters, projectName]
    }
  );

  const openDetailDrawer = useCallback(
    (whitelistId?: number) => {
      if (!whitelistId) {
        return;
      }
      dispatch(openWhitelistDetailDrawer(whitelistId));
    },
    [dispatch]
  );

  const openUpdateWhitelistModal = useCallback(
    (selectRow?: IAuditWhitelistResV1) => {
      updateSelectWhitelistRecord(selectRow ?? {});
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true
        })
      );
    },
    [dispatch, updateSelectWhitelistRecord]
  );

  const onView = useCallback(
    (selectRow?: IAuditWhitelistResV1) => {
      openDetailDrawer(selectRow?.audit_whitelist_id);
    },
    [openDetailDrawer]
  );

  const removeWhitelist = useCallback(
    (whitelistId: number) => {
      const hide = messageApi.loading(t('whitelist.operate.deleting'));
      AuditWhitelistService.deleteAuditWhitelistByIdV1({
        audit_whitelist_id: `${whitelistId}`,
        project_name: projectName
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('whitelist.operate.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refresh, t]
  );

  const whitelistActionsInTable: {
    buttons: ActiontechTableActionMeta<IAuditWhitelistResV1>[];
  } = useMemo(
    () => ({
      buttons: [
        {
          key: 'view-whitelist',
          text: t('ruleException.skippedSection.viewDetail'),
          buttonProps: (record) => ({
            onClick: () => onView(record)
          })
        },
        ...(actionPermission
          ? [
              {
                key: 'edit-whitelist',
                text: t('common.edit'),
                buttonProps: (record?: IAuditWhitelistResV1) => ({
                  onClick: () => openUpdateWhitelistModal(record)
                })
              },
              {
                key: 'remove-whitelist',
                text: t('common.delete'),
                buttonProps: () => ({ danger: true }),
                confirm: (record?: IAuditWhitelistResV1) => ({
                  title: t('whitelist.operate.confirmDelete'),
                  onConfirm: () =>
                    removeWhitelist(record?.audit_whitelist_id ?? 0)
                })
              }
            ]
          : [])
      ]
    }),
    [actionPermission, onView, openUpdateWhitelistModal, removeWhitelist, t]
  );

  const onExport = useCallback(() => {
    startExport();
    const hideLoading = messageApi.loading(t('whitelist.operate.exporting'), 0);
    const params = buildAuditWhitelistExportParams({
      projectName,
      globalSearchKeyword: searchKeyword,
      filters: listFilters
    });
    AuditWhitelistService.getAuditWhitelistExportsV1(params, {
      responseType: 'blob'
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('whitelist.operate.exportSuccess'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  }, [
    finishExport,
    listFilters,
    messageApi,
    projectName,
    searchKeyword,
    startExport,
    t
  ]);

  const updateAllSelectedFilterItem = useCallback(
    (checked: boolean) => {
      if (checked) {
        expandFilters();
        return;
      }
      collapseFilters();
      setListFilters(EMPTY_FILTER_VALUES);
    },
    [collapseFilters, expandFilters]
  );

  const filterButtonMeta = useMemo(
    () =>
      new Map([
        [
          'filter',
          {
            checked: filterExpanded,
            filterLabel: '',
            filterCustomType: 'select' as const
          }
        ]
      ]),
    [filterExpanded]
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Whitelist_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  useEffect(() => {
    const whitelistId = searchParams.get(AUDIT_WHITELIST_DETAIL_QUERY_KEY);
    if (whitelistId) {
      openDetailDrawer(Number(whitelistId));
    }
  }, [openDetailDrawer, searchParams]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={
          <BasicToolTips title={t('whitelist.pageTitleTips')} suffixIcon>
            {t('whitelist.pageTitle')}
          </BasicToolTips>
        }
        extra={[
          <EmptyBox if={exportVisible} key="export-whitelist">
            <BasicButton
              icon={<DownArrowLineOutlined fill="currentColor" />}
              onClick={onExport}
              disabled={exportButtonDisabled}
            >
              {t('whitelist.operate.export')}
            </BasicButton>
          </EmptyBox>,
          <EmptyBox if={actionPermission} key="add-whitelist">
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
              onClick={openCreateWhitelistModal}
            >
              {t('whitelist.operate.addWhitelist')}
            </BasicButton>
          </EmptyBox>
        ]}
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
          {filterExpanded ? (
            <AuditWhitelistListFilter
              projectName={projectName}
              filters={listFilters}
              onFiltersChange={setListFilters}
              disabled={loading}
            />
          ) : null}
        </Space>
      </TableToolbar>
      <ActiontechTable
        dataSource={whitelistList?.list as AuditWhitelistTableRow[] | undefined}
        rowKey={(record: IAuditWhitelistResV1) => {
          return `${record?.audit_whitelist_id}`;
        }}
        pagination={{
          total: whitelistList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        actions={whitelistActionsInTable}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        scroll={{}}
      />
      <WhitelistDrawer />
    </>
  );
};

export default WhitelistList;
