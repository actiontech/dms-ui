import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BasicButton, PageHeader } from '@actiontech/shared';
import SQLStatistics, { ISQLStatisticsProps } from '../SQLStatistics';
import {
  ActiontechTable,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  ColumnsSettingProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  IExportSqlManageV1Params,
  IGetSqlManageListV2Params
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import StatusFilter, { TypeStatus } from './StatusFilter';
import {
  GetSqlManageListV2FilterPriorityEnum,
  GetSqlManageListV2FilterStatusEnum,
  GetSqlManageListV2SortOrderEnum,
  exportSqlManageV1FilterPriorityEnum,
  exportSqlManageV1FilterStatusEnum,
  exportSqlManageRemediationV1ExportScopeEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import SqlManagementColumn, {
  SqlManagementRowAction,
  type SqlManagementTableFilterParamType
} from './column';
import { ModalName } from '../../../../data/ModalName';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import {
  ISourceExtra,
  ISqlManage
} from '@actiontech/shared/lib/api/sqle/service/common';
import { Spin, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import SqlManagementModal from './Modal';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { DB_TYPE_RULE_NAME_SEPARATOR } from '../../../../hooks/useRuleTips';
import useSqlManagementRedux from './hooks/useSqlManagementRedux';
import useBatchIgnoreOrSolve from './hooks/useBatchIgnoreOrSolve';
import { actionsButtonData, defaultActionButton } from './index.data';
import { DownArrowLineOutlined } from '@actiontech/icons';
import useSqlManagementExceptionRedux from '../../../SqlManagementException/hooks/useSqlManagementExceptionRedux';
import useWhitelistRedux from '../../../Whitelist/hooks/useWhitelistRedux';
import { toSqlManageRuleExceptionRecord } from '../../../RuleException/index.data';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlManagementListStyleWrapper } from './style';
import { pickStaticSqlManageFilters } from './sourceExtra.utils';
import useSqlManageSourceExtra from './hooks/useSqlManageSourceExtra';
import {
  getSqlManagementExportColumnKeys,
  SQL_MANAGEMENT_TABLE_NAME
} from './exportColumnKeys';

const SQLEEIndex = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  // api
  const { projectID, projectName, projectArchive } = useCurrentProject();
  const { isAdmin, username, isProjectManager, uid } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [filterStatus, setFilterStatus] = useState<TypeStatus>(
    GetSqlManageListV2FilterStatusEnum.unhandled
  );

  const { setSelectData, setBatchSelectData, updateModalStatus } =
    useSqlManagementRedux();

  const {
    openCreateSqlManagementExceptionModal,
    updateSelectSqlManagementExceptionRecord
  } = useSqlManagementExceptionRedux();

  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();

  const [isAssigneeSelf, setAssigneeSelf] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);
  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    sortInfo,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<ISqlManage, SqlManagementTableFilterParamType>();
  const [SQLNum, setSQLNum] = useState<ISQLStatisticsProps['data']>({
    SQLTotalNum: 0,
    problemSQlNum: 0,
    optimizedSQLNum: 0
  });

  const filterSource = tableFilterInfo.filter_source;

  const openModal = useCallback((name: ModalName, row?: ISqlManage) => {
    if (row) {
      setSelectData(row);
    }
    updateModalStatus(name, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpToAnalyze = useCallback(
    (sqlManageID: string) => {
      window.open(
        `/sqle/project/${projectID}/sql-management/${sqlManageID}/analyze`,
        '_blank'
      );
    },
    [projectID]
  );

  const onCreateSqlManagementException = useCallback(
    (record?: ISqlManage) => {
      const fingerprint =
        toSqlManageRuleExceptionRecord(record)?.sql_fingerprint?.trim();
      openCreateSqlManagementExceptionModal();
      updateSelectSqlManagementExceptionRecord(
        fingerprint
          ? {
              type: BlacklistResV1TypeEnum.fp_sql,
              content: fingerprint
            }
          : undefined
      );
    },
    [
      openCreateSqlManagementExceptionModal,
      updateSelectSqlManagementExceptionRecord
    ]
  );

  const onCreateWhitelist = useCallback(
    (record?: ISqlManage) => {
      openAuditWhitelistCreateWithPrefill(
        toSqlManageRuleExceptionRecord(record),
        { specificRuleScopeWithoutPreselect: true }
      );
    },
    [openAuditWhitelistCreateWithPrefill]
  );

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const updateRemarkProtect = useRef(false);
  const updateRemarkRef = useRef<(id: number, remark: string) => void>(
    () => undefined
  );

  const baseColumns = useMemo(
    () =>
      SqlManagementColumn(
        projectID,
        actionPermission && !projectArchive,
        (id, remark) => updateRemarkRef.current(id, remark),
        openModal
      ),
    [projectID, actionPermission, projectArchive, openModal]
  );

  const {
    columns,
    sourceExtraHeadList,
    filterButtonMeta,
    filterContainerMeta,
    filterCustomProps,
    updateAllSelectedFilterItem,
    handleSourceExtraFromResponse,
    buildExtraFiltersForRequest,
    resolveListSortField,
    joinListData
  } = useSqlManageSourceExtra({
    baseColumns,
    tableFilterInfo,
    updateTableFilterInfo,
    filterSource
  });

  const getCurrentSortParams = (
    sortData: SorterResult<ISqlManage> | SorterResult<ISqlManage>[]
  ): Pick<IGetSqlManageListV2Params, 'sort_field' | 'sort_order'> => {
    if (Array.isArray(sortData)) {
      return {};
    }
    const orderDesc = {
      descend: GetSqlManageListV2SortOrderEnum.desc,
      ascend: GetSqlManageListV2SortOrderEnum.asc
    };
    const rawSortField =
      typeof sortData.field === 'string' ? sortData.field : undefined;
    const sortField = resolveListSortField(rawSortField);

    return {
      sort_field: sortField,
      sort_order: sortField
        ? sortData?.order
          ? orderDesc[sortData?.order] ?? undefined
          : undefined
        : undefined
    };
  };

  const buildListRequestParams = useCallback((): IGetSqlManageListV2Params => {
    const { filter_rule_name, ...otherTableFilterInfo } = tableFilterInfo;
    const staticFilters = pickStaticSqlManageFilters(
      otherTableFilterInfo as Record<string, unknown>
    );

    return {
      ...(staticFilters as Partial<IGetSqlManageListV2Params>),
      ...pagination,
      ...getCurrentSortParams(sortInfo),
      filter_db_type: filter_rule_name?.split(DB_TYPE_RULE_NAME_SEPARATOR)?.[0],
      filter_rule_name: filter_rule_name?.split(
        DB_TYPE_RULE_NAME_SEPARATOR
      )?.[1],
      filter_status: filterStatus === 'all' ? undefined : filterStatus,
      fuzzy_search_sql_fingerprint: searchKeyword,
      project_name: projectName,
      filter_assignee: isAssigneeSelf ? uid : undefined,
      filter_priority: isHighPriority
        ? GetSqlManageListV2FilterPriorityEnum.high
        : undefined,
      extra_filters: buildExtraFiltersForRequest(tableFilterInfo)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableFilterInfo,
    buildExtraFiltersForRequest,
    pagination,
    sortInfo,
    filterStatus,
    searchKeyword,
    projectName,
    isAssigneeSelf,
    uid,
    isHighPriority,
    resolveListSortField
  ]);

  const {
    data: sqlList,
    loading: getListLoading,
    refresh,
    error: getListError
  } = useRequest(
    () => {
      return handleTableRequestError(
        SqlManage.GetSqlManageListV2(buildListRequestParams())
      );
    },
    {
      refreshDeps: [
        pagination,
        projectName,
        filterStatus,
        isAssigneeSelf,
        isHighPriority,
        tableFilterInfo,
        sortInfo
      ],
      onFinally: (_params, data) => {
        setSQLNum({
          SQLTotalNum: data?.otherData?.sql_manage_total_num ?? 0,
          problemSQlNum: data?.otherData?.sql_manage_bad_num ?? 0,
          optimizedSQLNum: data?.otherData?.sql_manage_optimized_num ?? 0
        });
        handleSourceExtraFromResponse(
          data?.otherData?.source_extra as ISourceExtra | undefined
        );
      }
    }
  );

  const updateRemark = useCallback(
    (id: number, remark: string) => {
      if (
        updateRemarkProtect.current ||
        !(actionPermission && !projectArchive)
      ) {
        return;
      }
      updateRemarkProtect.current = true;
      SqlManage.BatchUpdateSqlManage({
        project_name: projectName,
        sql_manage_id_list: [id],
        remark
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            refresh();
          }
        })
        .finally(() => {
          updateRemarkProtect.current = false;
        });
    },
    [actionPermission, projectName, refresh, projectArchive]
  );
  updateRemarkRef.current = updateRemark;

  const actions = useMemo(() => {
    return SqlManagementRowAction(
      openModal,
      jumpToAnalyze,
      isAdmin || isProjectManager(projectName),
      onCreateSqlManagementException,
      onCreateWhitelist
    );
  }, [
    isAdmin,
    isProjectManager,
    jumpToAnalyze,
    openModal,
    projectName,
    onCreateSqlManagementException,
    onCreateWhitelist
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<ISqlManage[]>([]);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: SQL_MANAGEMENT_TABLE_NAME,
      username: username
    }),
    [username]
  );

  const dataSource = useMemo(
    () => joinListData(sqlList?.list),
    [joinListData, sqlList?.list]
  );

  const rowSelection: TableRowSelection<ISqlManage> = {
    selectedRowKeys,
    onChange: (keys, data) => {
      setSelectedRowKeys(keys.filter((v) => v) as number[]);
      setSelectedRowData(data);
    }
  };

  // batch action
  const batchSuccessOperate = (msg: string) => {
    messageApi.success(msg);
    setSelectedRowKeys([]);
    refresh();
  };

  const { batchIgnoreLoading, batchSolveLoading, onBatchIgnore, onBatchSolve } =
    useBatchIgnoreOrSolve(
      actionPermission && !projectArchive,
      selectedRowKeys,
      batchSuccessOperate
    );

  // export
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const handleExport = () => {
    const extraKeys = sourceExtraHeadList.length
      ? sourceExtraHeadList
          .map((head) => head.name)
          .filter((name): name is string => !!name)
      : undefined;
    const exportColumnKeys = getSqlManagementExportColumnKeys(
      columns,
      username,
      extraKeys
    );

    if (!exportColumnKeys.length) {
      messageApi.warning(
        t('sqlManagement.pageHeader.action.noExportColumnTips')
      );
      return;
    }

    startExport();
    const hideLoading = messageApi.loading(
      t('sqlManagement.pageHeader.action.exporting')
    );
    const listParams = buildListRequestParams();
    const params = {
      ...listParams,
      filter_status:
        filterStatus === 'all'
          ? undefined
          : (filterStatus as unknown as exportSqlManageV1FilterStatusEnum),
      filter_priority: isHighPriority
        ? exportSqlManageV1FilterPriorityEnum.high
        : undefined,
      page_index: undefined,
      page_size: undefined,
      export_column_keys: exportColumnKeys.join(',')
    } as IExportSqlManageV1Params;
    SqlManage.exportSqlManageV1(params, { responseType: 'blob' })
      .then((res) => {
        if (
          (res.data as unknown as { code?: number }).code ===
          ResponseCode.SUCCESS
        ) {
          messageApi.success(
            t('sqlManagement.pageHeader.action.exportSuccessTips')
          );
        }
      })
      .catch((e: Error) => {
        messageApi.error(
          e?.message ?? t('sqlManagement.pageHeader.action.exportFailedTips')
        );
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };

  const handleRemediationExport = (scope: 'project' | 'global') => {
    if (!actionPermission || projectArchive) {
      return;
    }
    startExport();
    const hideLoading = messageApi.loading(
      t('sqlManagement.pageHeader.action.remediationExporting')
    );

    const exportPromise =
      scope === 'project'
        ? SqlManage.exportSqlManageRemediationV1(
            {
              project_name: projectName,
              export_scope: exportSqlManageRemediationV1ExportScopeEnum.project
            },
            { responseType: 'blob' }
          )
        : SqlManage.exportGlobalSqlManageRemediationV1({
            responseType: 'blob'
          });

    exportPromise
      .then((res) => {
        if (res.status === 200) {
          messageApi.success(
            t('sqlManagement.pageHeader.action.remediationExportSuccessTips')
          );
        }
      })
      .catch((e: Error) => {
        messageApi.error(
          e?.message ?? t('sqlManagement.pageHeader.action.exportFailedTips')
        );
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };

  const exportMenuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: 'sqlManage',
        label: t('sqlManagement.pageHeader.action.export')
      }
    ];

    if (actionPermission && !projectArchive) {
      items.push(
        {
          key: 'project',
          label: t(
            'sqlManagement.pageHeader.action.remediationExportCurrentProject'
          )
        },
        {
          key: 'global',
          label: t(
            'sqlManagement.pageHeader.action.remediationExportAllProjects'
          )
        }
      );
    }

    return items;
  }, [t, actionPermission, projectArchive]);

  const onExportMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'sqlManage') {
      handleExport();
      return;
    }
    handleRemediationExport(key as 'project' | 'global');
  };

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.Refresh_SQL_Management, refresh);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Refresh_SQL_Management, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBatchAssignment = () => {
    updateModalStatus(ModalName.Assignment_Member_Batch, true);
    // selectedRowData
    setBatchSelectData(selectedRowData);
  };

  const getTableActions = () => {
    const defaultButton = defaultActionButton({
      isAssigneeSelf,
      isHighPriority,
      setAssigneeSelf,
      setIsHighPriority
    });
    const actionButton = actionsButtonData(
      selectedRowKeys?.length === 0,
      batchSolveLoading,
      batchIgnoreLoading,
      onBatchAssignment,
      onBatchSolve,
      onBatchIgnore
    );
    return actionPermission && !projectArchive
      ? [...defaultButton, ...actionButton]
      : defaultButton;
  };

  return (
    <SqlManagementListStyleWrapper>
      <Spin spinning={getListLoading} delay={300}>
        {messageContextHolder}
        <PageHeader
          title={t('sqlManagement.pageTitle')}
          extra={
            exportMenuItems.length <= 1 ? (
              <BasicButton
                icon={<DownArrowLineOutlined />}
                disabled={exportButtonDisabled}
                onClick={handleExport}
              >
                {t('sqlManagement.pageHeader.action.exportReport')}
              </BasicButton>
            ) : (
              <Dropdown
                menu={{
                  items: exportMenuItems,
                  onClick: onExportMenuClick
                }}
                disabled={exportButtonDisabled}
              >
                <BasicButton
                  icon={<DownArrowLineOutlined />}
                  disabled={exportButtonDisabled}
                >
                  {t('sqlManagement.pageHeader.action.exportReport')}
                </BasicButton>
              </Dropdown>
            )
          }
        />
        <SQLStatistics
          data={SQLNum}
          errorMessage={getListError}
          loading={getListLoading}
        />
        <TableToolbar
          refreshButton={{ refresh, disabled: getListLoading }}
          setting={tableSetting}
          actions={getTableActions()}
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
        >
          <StatusFilter status={filterStatus} onChange={setFilterStatus} />
        </TableToolbar>
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={getListLoading}
          filterCustomProps={filterCustomProps}
        />
        <ActiontechTable
          className="table-row-cursor"
          disableRowHover
          setting={tableSetting}
          dataSource={dataSource}
          rowKey={(record: ISqlManage) => {
            return `${record?.id}`;
          }}
          rowSelection={rowSelection as TableRowSelection<ISqlManage>}
          pagination={{
            total: SQLNum.SQLTotalNum,
            current: pagination.page_index
          }}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          actions={projectArchive ? undefined : actions}
        />
        <SqlManagementModal />
      </Spin>
    </SqlManagementListStyleWrapper>
  );
};

export default SQLEEIndex;
