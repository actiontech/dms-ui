import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
  IGetSqlManageListV2Params,
  IGetSqlManageStatisticsV2Params
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
import { message, Dropdown } from 'antd';
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
import {
  BlacklistResV1TypeEnum,
  SqlManageAuditStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlManagementListStyleWrapper } from './style';
import { pickStaticSqlManageFilters } from './sourceExtra.utils';
import useSqlManageSourceExtra from './hooks/useSqlManageSourceExtra';
import {
  getSqlManagementExportColumnKeys,
  SQL_MANAGEMENT_TABLE_NAME
} from './exportColumnKeys';
import dayjs from 'dayjs';
import {
  leaveTabMessageKeyByStatus,
  mergeOptimisticList,
  OPTIMISTIC_GREEN_ROW_CLASS,
  SqlManageOptimisticPatch,
  SqlManageOptimisticWritePayload,
  willLeaveCurrentTab
} from './optimisticWrite';

const REFRESH_SUCCESS_VISIBLE_MS = 1000;
const OPTIMISTIC_GREEN_MIN_MS = 650;

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
    setPagination,
    sortInfo,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<ISqlManage, SqlManagementTableFilterParamType>();
  const [SQLNum, setSQLNum] = useState<ISQLStatisticsProps['data']>({
    SQLTotalNum: null,
    problemSQlNum: null,
    optimizedSQLNum: null
  });
  const [listTotal, setListTotal] = useState(0);
  const statisticsRequestSeq = useRef(0);
  const [refreshSpinning, setRefreshSpinning] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState('');
  const refreshSuccessTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const optimisticClearTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const optimisticGreenStartedAtRef = useRef<number | null>(null);
  const wasRefreshBusyRef = useRef(false);
  const writeRefreshPendingRef = useRef(false);
  const filterStatusRef = useRef(filterStatus);
  filterStatusRef.current = filterStatus;
  const [
    auditPolling,
    { setFalse: finishAuditPollRequest, setTrue: startAuditPollRequest }
  ] = useBoolean(false);
  const auditPollingActiveRef = useRef(false);
  const refreshStatisticsRef = useRef<() => void>(() => undefined);

  const [optimisticOverlay, setOptimisticOverlay] = useState<
    Record<number, SqlManageOptimisticPatch>
  >({});
  const [optimisticGreenIds, setOptimisticGreenIds] = useState<Set<number>>(
    () => new Set()
  );
  const [optimisticHiddenIds, setOptimisticHiddenIds] = useState<Set<number>>(
    () => new Set()
  );

  const clearOptimisticState = useCallback(() => {
    setOptimisticOverlay({});
    setOptimisticGreenIds(new Set());
    setOptimisticHiddenIds(new Set());
  }, []);

  const waitAndClearOptimisticAfterMinGreen = useCallback(async () => {
    const startedAt = optimisticGreenStartedAtRef.current ?? Date.now();
    const waitMs = Math.max(
      0,
      OPTIMISTIC_GREEN_MIN_MS - (Date.now() - startedAt)
    );
    if (optimisticClearTimerRef.current) {
      clearTimeout(optimisticClearTimerRef.current);
      optimisticClearTimerRef.current = undefined;
    }
    if (waitMs > 0) {
      await new Promise<void>((resolve) => {
        optimisticClearTimerRef.current = setTimeout(() => {
          optimisticClearTimerRef.current = undefined;
          resolve();
        }, waitMs);
      });
    }
    clearOptimisticState();
    optimisticGreenStartedAtRef.current = null;
  }, [clearOptimisticState]);

  const resetPageIndex = useCallback(() => {
    setPagination((prevPage) => ({
      page_index: 1,
      page_size: prevPage.page_size
    }));
  }, [setPagination]);

  const onFilterStatusChange = useCallback(
    (status: TypeStatus) => {
      setFilterStatus(status);
      resetPageIndex();
    },
    [resetPageIndex]
  );

  const onAssigneeSelfChange = useCallback(
    (value: boolean) => {
      setAssigneeSelf(value);
      resetPageIndex();
    },
    [resetPageIndex]
  );

  const onHighPriorityChange = useCallback(
    (value: boolean) => {
      setIsHighPriority(value);
      resetPageIndex();
    },
    [resetPageIndex]
  );

  const applyOptimisticWrite = useCallback(
    (payload: SqlManageOptimisticWritePayload) => {
      const ids = payload.ids.filter((id) => Number.isFinite(id));
      if (!ids.length) {
        return;
      }
      const nextStatus = payload.patch?.status;
      const leave =
        !!nextStatus &&
        willLeaveCurrentTab(filterStatusRef.current, nextStatus);

      if (optimisticClearTimerRef.current) {
        clearTimeout(optimisticClearTimerRef.current);
        optimisticClearTimerRef.current = undefined;
      }

      // 先同步上色，避免双刷回写抢在首次 paint 前把计时吃掉
      flushSync(() => {
        setOptimisticOverlay((prev) => {
          const next = { ...prev };
          ids.forEach((id) => {
            next[id] = { ...next[id], ...payload.patch };
          });
          return next;
        });
        setOptimisticGreenIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.add(id));
          return next;
        });
        if (leave) {
          setOptimisticHiddenIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.add(id));
            return next;
          });
        }
      });
      optimisticGreenStartedAtRef.current = Date.now();

      if (leave) {
        const leaveKey = nextStatus
          ? leaveTabMessageKeyByStatus(nextStatus)
          : undefined;
        if (leaveKey) {
          messageApi.success(t(leaveKey));
        }
      } else if (payload.successMessage) {
        messageApi.success(payload.successMessage);
      }
    },
    [messageApi, t]
  );

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
      if (record) {
        setSelectData(record);
      }
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
      setSelectData,
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

  const buildStatisticsRequestParams =
    useCallback((): IGetSqlManageStatisticsV2Params => {
      const {
        page_index: _pageIndex,
        page_size: _pageSize,
        sort_field: _sortField,
        sort_order: _sortOrder,
        ...filterParams
      } = buildListRequestParams();
      return filterParams;
    }, [buildListRequestParams]);

  const {
    data: sqlList,
    loading: getListLoading,
    refresh,
    cancel: cancelListRequest
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
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      onFinally: (_params, data, error) => {
        const hasBeingAudited =
          !error &&
          !!data?.list?.some(
            (item) =>
              item?.audit_status === SqlManageAuditStatusEnum.being_audited
          );

        if (!error) {
          setListTotal(data?.otherData?.sql_manage_total_num ?? 0);
          handleSourceExtraFromResponse(
            data?.otherData?.source_extra as ISourceExtra | undefined
          );
        }

        if (hasBeingAudited) {
          auditPollingActiveRef.current = true;
          startAuditPollRequest();
          return;
        }

        const shouldRefreshStatisticsAfterPoll = auditPollingActiveRef.current;
        auditPollingActiveRef.current = false;
        cancelListRequest();
        finishAuditPollRequest();
        if (shouldRefreshStatisticsAfterPoll) {
          refreshStatisticsRef.current();
        }
      }
    }
  );

  const { refresh: refreshStatistics, loading: getStatisticsLoading } =
    useRequest(
      () => {
        const seq = ++statisticsRequestSeq.current;
        return SqlManage.GetSqlManageStatisticsV2(
          buildStatisticsRequestParams()
        ).then((res) => {
          if (seq !== statisticsRequestSeq.current) {
            return;
          }
          if (res.data.code === ResponseCode.SUCCESS) {
            setSQLNum({
              SQLTotalNum: res.data.sql_manage_total_num ?? 0,
              problemSQlNum: res.data.sql_manage_bad_num ?? 0,
              optimizedSQLNum: res.data.sql_manage_optimized_num ?? 0
            });
          }
        });
      },
      {
        refreshDeps: [
          projectName,
          filterStatus,
          isAssigneeSelf,
          isHighPriority,
          tableFilterInfo
        ]
      }
    );
  refreshStatisticsRef.current = refreshStatistics;

  // 审核中轮询：列表 loading 不驱动刷新按钮长时间转圈
  const listLoadingForUi = auditPolling ? false : getListLoading;
  const refreshBusy = listLoadingForUi || getStatisticsLoading;

  useEffect(() => {
    if (refreshBusy) {
      wasRefreshBusyRef.current = true;
      setRefreshSpinning(true);
      setRefreshSuccess(false);
      return;
    }
    if (!wasRefreshBusyRef.current) {
      return;
    }
    wasRefreshBusyRef.current = false;
    setRefreshSpinning(false);
    setRefreshSuccess(true);
    setLastRefreshTime(dayjs().format('HH:mm:ss'));
    if (refreshSuccessTimerRef.current) {
      clearTimeout(refreshSuccessTimerRef.current);
    }
    refreshSuccessTimerRef.current = setTimeout(() => {
      setRefreshSuccess(false);
    }, REFRESH_SUCCESS_VISIBLE_MS);
  }, [refreshBusy]);

  useEffect(() => {
    return () => {
      if (refreshSuccessTimerRef.current) {
        clearTimeout(refreshSuccessTimerRef.current);
      }
      if (optimisticClearTimerRef.current) {
        clearTimeout(optimisticClearTimerRef.current);
      }
    };
  }, []);

  const refreshAll = useCallback(() => {
    refresh();
    refreshStatistics();
  }, [refresh, refreshStatistics]);

  const runDualRefreshAfterWrite = useCallback(async () => {
    writeRefreshPendingRef.current = true;
    try {
      await Promise.all([refresh(), refreshStatistics()]);
      await waitAndClearOptimisticAfterMinGreen();
    } catch {
      messageApi.warning(
        t('sqlManagement.table.action.optimistic.syncFailedRetry')
      );
    } finally {
      writeRefreshPendingRef.current = false;
    }
  }, [
    messageApi,
    refresh,
    refreshStatistics,
    waitAndClearOptimisticAfterMinGreen,
    t
  ]);

  const onSqlManagementRefresh = useCallback(
    (payload?: SqlManageOptimisticWritePayload) => {
      if (payload?.ids?.length) {
        applyOptimisticWrite(payload);
        void runDualRefreshAfterWrite();
        return;
      }
      refreshAll();
    },
    [applyOptimisticWrite, refreshAll, runDualRefreshAfterWrite]
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
            onSqlManagementRefresh({
              ids: [id],
              patch: { remark }
            });
          }
        })
        .finally(() => {
          updateRemarkProtect.current = false;
        });
    },
    [actionPermission, projectName, projectArchive, onSqlManagementRefresh]
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
    () =>
      mergeOptimisticList(
        joinListData(sqlList?.list),
        optimisticOverlay,
        optimisticHiddenIds
      ),
    [joinListData, sqlList?.list, optimisticOverlay, optimisticHiddenIds]
  );

  const rowSelection: TableRowSelection<ISqlManage> = {
    selectedRowKeys,
    onChange: (keys, data) => {
      setSelectedRowKeys(keys.filter((v) => v) as number[]);
      setSelectedRowData(data);
    }
  };

  // batch action
  const batchSuccessOperate = (
    msg: string,
    payload?: SqlManageOptimisticWritePayload
  ) => {
    if (payload?.ids?.length) {
      applyOptimisticWrite({
        ...payload,
        successMessage: payload.successMessage ?? msg
      });
      setSelectedRowKeys([]);
      void runDualRefreshAfterWrite();
      return;
    }
    messageApi.success(msg);
    setSelectedRowKeys([]);
    refreshAll();
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

    // 当前项目整改导出跟随列表生效筛参；跨项目全局导出不带项目内筛选
    const exportPromise =
      scope === 'project'
        ? (() => {
            const listParams = buildListRequestParams();
            return SqlManage.exportSqlManageRemediationV1(
              {
                project_name: projectName,
                export_scope:
                  exportSqlManageRemediationV1ExportScopeEnum.project,
                fuzzy_search_sql_fingerprint:
                  listParams.fuzzy_search_sql_fingerprint,
                filter_assignee: listParams.filter_assignee,
                filter_business: listParams.filter_business,
                filter_instance_id: listParams.filter_instance_id,
                filter_source: listParams.filter_source,
                filter_audit_level: listParams.filter_audit_level,
                filter_last_audit_start_time_from:
                  listParams.filter_last_audit_start_time_from,
                filter_last_audit_start_time_to:
                  listParams.filter_last_audit_start_time_to,
                filter_status: listParams.filter_status,
                filter_db_type: listParams.filter_db_type,
                filter_rule_name: listParams.filter_rule_name,
                filter_priority: listParams.filter_priority,
                fuzzy_search_endpoint: listParams.fuzzy_search_endpoint,
                fuzzy_search_schema_name: listParams.fuzzy_search_schema_name,
                extra_filters: listParams.extra_filters
              },
              { responseType: 'blob' }
            );
          })()
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
    EventEmitter.subscribe(
      EmitterKey.Refresh_SQL_Management,
      onSqlManagementRefresh
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_SQL_Management,
        onSqlManagementRefresh
      );
    };
  }, [onSqlManagementRefresh]);

  const onBatchAssignment = () => {
    updateModalStatus(ModalName.Assignment_Member_Batch, true);
    // selectedRowData
    setBatchSelectData(selectedRowData);
  };

  const getTableActions = () => {
    const defaultButton = defaultActionButton({
      isAssigneeSelf,
      isHighPriority,
      setAssigneeSelf: onAssigneeSelfChange,
      setIsHighPriority: onHighPriorityChange
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
      <SQLStatistics data={SQLNum} loading={false} />
      <TableToolbar
        refreshButton={{
          refresh: refreshAll,
          refreshing: refreshSpinning,
          success: refreshSuccess,
          lastRefreshTime,
          disabled: refreshSpinning
        }}
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
            refreshStatistics();
          }
        }}
      >
        <StatusFilter status={filterStatus} onChange={onFilterStatusChange} />
      </TableToolbar>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={listLoadingForUi}
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
        rowClassName={(record: ISqlManage) =>
          record.id != null && optimisticGreenIds.has(Number(record.id))
            ? OPTIMISTIC_GREEN_ROW_CLASS
            : ''
        }
        rowSelection={rowSelection as TableRowSelection<ISqlManage>}
        pagination={{
          total: listTotal,
          current: pagination.page_index
        }}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={projectArchive ? undefined : actions}
        {...(requestErrorMessage
          ? {}
          : {
              locale: {
                emptyText: t('sqlManagement.table.emptyFilterResult')
              }
            })}
      />
      <SqlManagementModal />
    </SqlManagementListStyleWrapper>
  );
};

export default SQLEEIndex;
