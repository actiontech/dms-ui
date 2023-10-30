import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { BasicButton, PageHeader } from '@actiontech/shared';
import { IconDownload } from '@actiontech/shared/lib/Icon';
import SQLStatistics, { ISQLStatisticsProps } from '../SQLStatistics';
import {
  ActiontechTable,
  useTableFilterContainer,
  useTableRequestError,
  TableFilterContainer,
  TableToolbar,
  FilterCustomProps,
  ColumnsSettingProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';

import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import {
  IExportSqlManageV1Params,
  IGetSqlManageListParams
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import StatusFilter, { TypeStatus } from './StatusFilter';
import {
  GetSqlManageListFilterStatusEnum,
  exportSqlManageV1FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import useInstance from '../../../../hooks/useInstance';
import SqlManagementColumn, {
  ExtraFilterMeta,
  SqlManagementRowAction,
  type SqlManagementTableFilterParamType
} from './column';
import useStaticStatus from '../../../../hooks/useStaticStatus';
import {
  initSqleManagementModalStatus,
  updateSqleManagement,
  updateSqleManagementModalStatus
} from '../../../../store/sqleManagement';
import { ModalName } from '../../../../data/ModalName';
import { TableRowSelection } from 'antd5/es/table/interface';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { tableSingleData } from './mock.data';
import { message } from 'antd5';
import SqleManagementModal from './Modal';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const SQLEEIndex = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  // api
  // todo: 接口联调
  const { projectID, projectName } = useCurrentProject();
  const { isAdmin, username, isProjectManager, uid } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [filterStatus, setFilterStatus] = useState<TypeStatus>(
    GetSqlManageListFilterStatusEnum.unhandled
  );
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isAssigneeSelf, setAssigneeSelf] = useState(false);
  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<ISqlManage, SqlManagementTableFilterParamType>();
  const [SQLNum, setSQLNum] = useState<ISQLStatisticsProps['data']>({
    SQLTotalNum: 0,
    problemSQlNum: 0,
    optimizedSQLNum: 0
  });
  // todo: 列表数据 与 统计数据是一起返回的
  // filter_assignee 需要用 id
  const {
    data: sqlList,
    loading: getListLoading,
    refresh,
    error: getListError
  } = useRequest(
    () => {
      const params: IGetSqlManageListParams = {
        ...tableFilterInfo,
        ...pagination,
        filter_status: filterStatus === 'all' ? undefined : filterStatus,
        fuzzy_search_sql_fingerprint: searchKeyword,
        project_name: projectName,
        filter_assignee: isAssigneeSelf ? uid : undefined
      };
      return handleTableRequestError(SqlManage.GetSqlManageList(params));
    },
    {
      refreshDeps: [
        pagination,
        projectName,
        filterStatus,
        searchKeyword,
        isAssigneeSelf
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

  // table
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      initSqleManagementModalStatus({
        modalStatus: {
          [ModalName.Assignment_Member_Single]: false,
          [ModalName.Assignment_Member_Batch]: false,
          [ModalName.Change_Status_Single]: false,
          [ModalName.View_Audit_Result_Drawer]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = useCallback(
    (name: ModalName, row?: ISqlManage) => {
      if (row) {
        dispatch(updateSqleManagement(row));
      }

      dispatch(
        updateSqleManagementModalStatus({
          modalName: name,
          status: true
        })
      );
      console.log(name);
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return SqlManagementRowAction(openModal);
  }, [openModal]);

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);
  const { instanceOptions, updateInstanceList } = useInstance();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const updateRemarkProtect = useRef(false);
  const updateRemark = useCallback(
    (id: number, remark: string) => {
      if (updateRemarkProtect.current || !actionPermission) {
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
    [actionPermission, projectName, refresh]
  );

  const columns = useMemo(
    () =>
      SqlManagementColumn(projectID, actionPermission, updateRemark, openModal),
    [projectID, actionPermission, updateRemark, openModal]
  );
  const { getAuditLevelStatusSelectOption } = useStaticStatus();
  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_management_list',
      username: username
    }),
    [username]
  );
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  // todo: filter option data
  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (ISqlManage & {
        filter_source?: string;
        filter_instance_name?: string;
        filter_audit_level?: string;
      }),
      FilterCustomProps
    >([
      ['filter_source', { options: [{ label: 'source11', value: 11 }] }],
      ['filter_instance_name', { options: instanceOptions }],
      ['filter_audit_level', { options: [{ label: 'level11', value: 11 }] }]
    ]);
  }, [instanceOptions]);

  const onSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const rowSelection: TableRowSelection<ISqlManage> = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
    }
  };

  // batch action
  const [
    batchActionsLoading,
    { setFalse: finishBatchAction, setTrue: startBatchAction }
  ] = useBoolean();
  const onBatchSolve = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: selectedRowKeys
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.batch.solveSuccessTips')
          );
          setSelectedRowKeys([]);
          refresh();
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };
  const onBatchIgnore = () => {
    if (!actionPermission || selectedRowKeys.length === 0) {
      return;
    }
    startBatchAction();
    SqlManage.BatchUpdateSqlManage({
      project_name: projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: selectedRowKeys
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.batch.ignoreSuccessTips')
          );
          setSelectedRowKeys([]);
          refresh();
        }
      })
      .finally(() => {
        finishBatchAction();
      });
  };

  // row action
  const onAssignment = (record: ISqlManage) => {
    //
  };

  const onChangeStatus = (record: ISqlManage) => {
    //
  };

  // export
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const handleExport = () => {
    if (!actionPermission) {
      return;
    }
    startExport();
    const hideLoading = messageApi.loading(
      t('sqlManagement.pageHeader.action.exporting')
    );
    const params = {
      ...tableFilterInfo,
      filter_status:
        filterStatus === 'all'
          ? undefined
          : (filterStatus as unknown as exportSqlManageV1FilterStatusEnum),
      fuzzy_search_sql_fingerprint: searchKeyword,
      project_name: projectName,
      filter_assignee: isAssigneeSelf ? uid : undefined
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

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('sqlManagement.pageTitle')}
        extra={
          actionPermission ? (
            <BasicButton
              onClick={handleExport}
              icon={<IconDownload />}
              disabled={exportButtonDisabled}
            >
              {t('sqlManagement.pageHeader.action.export')}
            </BasicButton>
          ) : null
        }
      />
      {/* page */}
      {/* page - total */}
      <SQLStatistics
        data={SQLNum}
        // loading={getListLoading}
        loading={false}
        errorMessage={getListError}
      />
      {/* table  */}
      <TableToolbar
        refreshButton={{ refresh, disabled: getListLoading }}
        setting={tableSetting}
        actions={
          actionPermission
            ? [
                {
                  key: 'assignment-self',
                  text: t('sqlManagement.table.filter.assignee'),
                  buttonProps: {
                    className: isAssigneeSelf
                      ? 'switch-btn-active'
                      : 'switch-btn-default',
                    onClick: () => {
                      setAssigneeSelf(!isAssigneeSelf);
                    }
                  }
                },
                {
                  key: 'batch-assignment',
                  text: t('sqlManagement.table.action.batch.assignment'),
                  buttonProps: {
                    disabled: selectedRowKeys?.length === 0,
                    onClick: () => {
                      dispatch(
                        updateSqleManagementModalStatus({
                          modalName: ModalName.Assignment_Member_Batch,
                          status: true
                        })
                      );
                    }
                  }
                },
                {
                  key: 'batch-solve',
                  text: t('sqlManagement.table.action.batch.solve'),
                  buttonProps: {
                    disabled: selectedRowKeys?.length === 0
                  },
                  confirm: {
                    onConfirm: onBatchSolve,
                    title: t('sqlManagement.table.action.batch.solveTips'),
                    okButtonProps: {
                      disabled: batchActionsLoading
                    }
                  }
                },
                {
                  key: 'batch-ignore',
                  text: t('sqlManagement.table.action.batch.ignore'),
                  buttonProps: {
                    disabled: selectedRowKeys?.length === 0
                  },
                  confirm: {
                    onConfirm: onBatchIgnore,
                    title: t('sqlManagement.table.action.batch.ignoreTips'),
                    okButtonProps: {
                      disabled: batchActionsLoading
                    }
                  }
                }
              ]
            : false
        }
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onSearch
        }}
        // loading={getListLoading}
        loading={false}
      >
        <StatusFilter status={filterStatus} onChange={setFilterStatus} />
      </TableToolbar>
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        // disabled={getListLoading}
        disabled={false}
        filterCustomProps={filterCustomProps}
      />
      <ActiontechTable
        className="table-row-cursor"
        setting={tableSetting}
        // dataSource={sqlList?.list ?? [tableSingleData]}
        dataSource={[tableSingleData]}
        rowKey={(record: ISqlManage) => {
          return `${record?.id}`;
        }}
        rowSelection={rowSelection as TableRowSelection<ISqlManage>}
        pagination={{
          total: sqlList?.total ?? 0
        }}
        // loading={getListLoading}
        loading={false}
        // columns 为空？？？
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actionPermission ? actions : []}
      />
      {/* modal & drawer */}
      <SqleManagementModal />
    </>
  );
};

export default SQLEEIndex;
