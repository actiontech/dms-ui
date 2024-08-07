import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BasicButton, PageHeader } from '@actiontech/shared';
import SQLStatistics, { ISQLStatisticsProps } from '../SQLStatistics';
import {
  ActiontechTable,
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
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import StatusFilter, { TypeStatus } from './StatusFilter';
import {
  GetSqlManageListV2FilterStatusEnum,
  GetSqlManageListV2SortFieldEnum,
  GetSqlManageListV2SortOrderEnum,
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

  const [isAssigneeSelf, setAssigneeSelf] = useState(false);
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
    error: getListError
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
        filter_assignee: isAssigneeSelf ? uid : undefined // filter_assignee 需要用 id
      };
      return handleTableRequestError(SqlManage.GetSqlManageListV2(params));
    },
    {
      refreshDeps: [
        pagination,
        projectName,
        filterStatus,
        isAssigneeSelf,
        tableFilterInfo,
        sortInfo
      ],
      onFinally: (params, data) => {
        setSQLNum({
          SQLTotalNum: data?.otherData?.sql_manage_total_num ?? 0,
          problemSQlNum: data?.otherData?.sql_manage_bad_num ?? 0,
          optimizedSQLNum: data?.otherData?.sql_manage_optimized_num ?? 0
        });
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

  const actions = useMemo(() => {
    return SqlManagementRowAction(
      openModal,
      jumpToAnalyze,
      isAdmin || isProjectManager(projectName)
    );
  }, [isAdmin, isProjectManager, jumpToAnalyze, openModal, projectName]);

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<ISqlManage[]>([]);

  const updateRemarkProtect = useRef(false);
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

  const columns = useMemo(
    () =>
      SqlManagementColumn(
        projectID,
        actionPermission && !projectArchive,
        updateRemark,
        openModal
      ),
    [projectID, actionPermission, projectArchive, updateRemark, openModal]
  );

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      // todo 暂时通过更新 tableName 的方式解决表格列的缓存问题，等问题解决后移出。
      tableName: 'sql_management_list_v2',
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
      filter_assignee: isAssigneeSelf ? uid : undefined,
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
    const defaultButton = defaultActionButton(isAssigneeSelf, setAssigneeSelf);
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
    <Spin spinning={getListLoading} delay={300}>
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
        loading={getListLoading}
      />
      {/* table  */}
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
        actions={projectArchive ? undefined : actions}
      />
      {/* modal & drawer */}
      <SqlManagementModal />
    </Spin>
  );
};

export default SQLEEIndex;
