import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BasicButton, PageHeader } from '@actiontech/shared';
import SQLStatistics, { ISQLStatisticsProps } from '../SQLStatistics';
import {
  useTableFilterContainer,
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
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import StatusFilter, { TypeStatus } from './StatusFilter';
import {
  GetSqlManageListV2FilterPriorityEnum,
  GetSqlManageListV2FilterStatusEnum,
  GetSqlManageListV2SortFieldEnum,
  GetSqlManageListV2SortOrderEnum,
  exportSqlManageV1FilterPriorityEnum,
  exportSqlManageV1FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import SqlManagementColumn, {
  ExtraFilterMeta,
  SqlManagementRowAction,
  type SqlManagementTableFilterParamType
} from './column';
import { ModalName } from '../../../../data/ModalName';
import { SorterResult, TableRowSelection } from 'antd/es/table/interface';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { Spin, message } from 'antd';
import SqlManagementModal from './Modal';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { DB_TYPE_RULE_NAME_SEPARATOR } from './hooks/useRuleTips';
import useSqlManagementRedux from './hooks/useSqlManagementRedux';
import useBatchIgnoreOrSolve from './hooks/useBatchIgnoreOrSolve';
import { actionsButtonData, defaultActionButton } from './index.data';
import useGetTableFilterInfo from './hooks/useGetTableFilterInfo';
import { DownArrowLineOutlined } from '@actiontech/icons';
import useSqlManagementExceptionRedux from '../../../SqlManagementException/hooks/useSqlManagementExceptionRedux';
import useWhitelistRedux from '../../../Whitelist/hooks/useWhitelistRedux';
import { SqlManagementTableStyleWrapper } from './style';
import { SqlManageAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const SQLEEIndex = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { parse2TableActionPermissions, parse2TableToolbarActionPermissions } =
    usePermission();
  // api
  const { projectID, projectName } = useCurrentProject();
  const { username, userId, language } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [filterStatus, setFilterStatus] = useState<TypeStatus>(
    GetSqlManageListV2FilterStatusEnum.unhandled
  );

  const [polling, { setFalse: finishPollRequest, setTrue: startPollRequest }] =
    useBoolean();

  const { setSelectData, setBatchSelectData, updateModalStatus } =
    useSqlManagementRedux();

  const {
    openCreateSqlManagementExceptionModal,
    updateSelectSqlManagementExceptionRecord
  } = useSqlManagementExceptionRedux();

  const { openCreateWhitelistModal, updateSelectWhitelistRecord } =
    useWhitelistRedux();

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

    return {
      sort_field:
        (sortData.field as unknown as GetSqlManageListV2SortFieldEnum) ??
        undefined,
      sort_order: sortData?.order
        ? orderDesc[sortData?.order] ?? undefined
        : undefined
    };
  };

  const {
    data: sqlList,
    loading: getListLoading,
    refresh,
    error: getListError,
    cancel
  } = useRequest(
    () => {
      const { filter_rule_name, ...otherTableFilterInfo } = tableFilterInfo;
      const params: IGetSqlManageListV2Params = {
        ...otherTableFilterInfo,
        ...pagination,
        ...getCurrentSortParams(sortInfo),
        filter_db_type: filter_rule_name?.split(
          DB_TYPE_RULE_NAME_SEPARATOR
        )?.[0],
        filter_rule_name: filter_rule_name?.split(
          DB_TYPE_RULE_NAME_SEPARATOR
        )?.[1],
        filter_status: filterStatus === 'all' ? undefined : filterStatus,
        fuzzy_search_sql_fingerprint: searchKeyword,
        project_name: projectName,
        filter_assignee: isAssigneeSelf ? userId : undefined, // filter_assignee 需要用 id
        filter_priority: isHighPriority
          ? GetSqlManageListV2FilterPriorityEnum.high
          : undefined
      };
      return handleTableRequestError(SqlManage.GetSqlManageListV2(params));
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
      onFinally: (params, data) => {
        setSQLNum({
          SQLTotalNum: data?.otherData?.sql_manage_total_num ?? 0,
          problemSQlNum: data?.otherData?.sql_manage_bad_num ?? 0,
          optimizedSQLNum: data?.otherData?.sql_manage_optimized_num ?? 0
        });

        if (
          data?.list?.some(
            (item) =>
              item?.audit_status === SqlManageAuditStatusEnum.being_audited
          )
        ) {
          startPollRequest();
        } else {
          cancel();
          finishPollRequest();
        }
      }
    }
  );

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
      openCreateSqlManagementExceptionModal();
      updateSelectSqlManagementExceptionRecord({
        content: record?.sql
      });
    },
    [
      openCreateSqlManagementExceptionModal,
      updateSelectSqlManagementExceptionRecord
    ]
  );

  const onCreateWhitelist = useCallback(
    (record?: ISqlManage) => {
      openCreateWhitelistModal();
      updateSelectWhitelistRecord({
        value: record?.sql
      });
    },
    [openCreateWhitelistModal, updateSelectWhitelistRecord]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      SqlManagementRowAction(
        openModal,
        jumpToAnalyze,
        onCreateSqlManagementException,
        onCreateWhitelist,
        language
      )
    );
  }, [
    jumpToAnalyze,
    openModal,
    onCreateSqlManagementException,
    onCreateWhitelist,
    language,
    parse2TableActionPermissions
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<ISqlManage[]>([]);

  const updateRemarkProtect = useRef(false);
  const updateRemark = useCallback(
    (id: number, remark: string) => {
      if (updateRemarkProtect.current) {
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
    [projectName, refresh]
  );

  const columns = useMemo(
    () => SqlManagementColumn(projectID, updateRemark, openModal),
    [projectID, updateRemark, openModal]
  );

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_management_list',
      username: username
    }),
    [username]
  );
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const { filterCustomProps } = useGetTableFilterInfo();

  const rowSelection: TableRowSelection<ISqlManage> = {
    selectedRowKeys,
    onChange: (keys, data) => {
      setSelectedRowKeys(keys.filter((v) => v) as number[]);
      setSelectedRowData(data);
    },
    columnWidth: 80,
    fixed: true
  };

  // batch action
  const batchSuccessOperate = (msg: string) => {
    messageApi.success(msg);
    setSelectedRowKeys([]);
    refresh();
  };

  const { batchIgnoreLoading, batchSolveLoading, onBatchIgnore, onBatchSolve } =
    useBatchIgnoreOrSolve(selectedRowKeys, batchSuccessOperate);

  // export
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const handleExport = () => {
    startExport();
    const hideLoading = messageApi.loading(
      t('sqlManagement.pageHeader.action.exporting')
    );
    const { filter_rule_name, ...otherTableFilterInfo } = tableFilterInfo;

    const params = {
      ...otherTableFilterInfo,
      filter_status:
        filterStatus === 'all'
          ? undefined
          : (filterStatus as unknown as exportSqlManageV1FilterStatusEnum),
      fuzzy_search_sql_fingerprint: searchKeyword,
      project_name: projectName,
      filter_assignee: isAssigneeSelf ? userId : undefined,
      filter_priority: isHighPriority
        ? exportSqlManageV1FilterPriorityEnum.high
        : undefined,
      filter_db_type: filter_rule_name?.split(DB_TYPE_RULE_NAME_SEPARATOR)?.[0],
      filter_rule_name: filter_rule_name?.split(
        DB_TYPE_RULE_NAME_SEPARATOR
      )?.[1]
    } as IExportSqlManageV1Params;
    SqlManage.exportSqlManageV1(params, { responseType: 'blob' })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.pageHeader.action.exportSuccessTips')
          );
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
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
    const actionButton = parse2TableToolbarActionPermissions(
      actionsButtonData(
        selectedRowKeys?.length === 0,
        batchSolveLoading,
        batchIgnoreLoading,
        onBatchAssignment,
        onBatchSolve,
        onBatchIgnore
      )
    );
    return [...defaultButton, ...actionButton];
  };

  const loading = useMemo(
    () => (polling ? false : getListLoading),
    [polling, getListLoading]
  );

  return (
    <Spin spinning={loading} delay={300}>
      {messageContextHolder}
      <PageHeader
        title={t('sqlManagement.pageTitle')}
        extra={
          <BasicButton
            onClick={handleExport}
            icon={<DownArrowLineOutlined />}
            disabled={exportButtonDisabled}
          >
            {t('sqlManagement.pageHeader.action.export')}
          </BasicButton>
        }
      />
      {/* page */}
      {/* page - total */}
      <SQLStatistics
        data={SQLNum}
        errorMessage={getListError}
        loading={loading}
      />
      {/* table  */}
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
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
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <SqlManagementTableStyleWrapper
        className="table-row-cursor"
        setting={tableSetting}
        dataSource={sqlList?.list}
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
        actions={actions}
        scroll={{ x: '130%', y: '500px' }}
      />
      {/* scroll 中的y 只支持string | number 所以这里的 500px 只是为了开启antd的固定列功能随便写的高度 具体高度在styled中动态计算 */}
      {/* modal & drawer */}
      <SqlManagementModal />
    </Spin>
  );
};

export default SQLEEIndex;
