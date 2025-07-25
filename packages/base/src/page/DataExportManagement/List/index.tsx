import { PageHeader, useTypedNavigate } from '@actiontech/shared';
import {
  useTableRequestParams,
  TableToolbar,
  useTableRequestError,
  ColumnsSettingProps,
  useTableFilterContainer,
  TableFilterContainer,
  FilterCustomProps,
  ActiontechTable,
  ActiontechTableWrapper
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ExportWorkflowExtraFilterMeta,
  ExportWorkflowListColumn,
  ExportWorkflowListFilterParamType
} from './column';
import { TableRowSelection } from 'antd/es/table/interface';
import WorkflowStatusFilter from './components/WorkflowStatusFilter';
import useDbService from '../../../hooks/useDbService';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { IListDataExportWorkflowsParams } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.d';
import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { ListDataExportWorkflowsFilterByStatusEnum } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.enum';
import useMemberTips from '../../../hooks/useMemberTips';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import {
  DataExportManagementTableToolbarActions,
  DataExportManagementCreateAction
} from './actions';
import { IListDataExportWorkflowWithExtraParams } from './index.type';

const ExportWorkflowList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();
  const { username } = useCurrentUser();

  const { parse2TableToolbarActionPermissions, checkActionPermission } =
    usePermission();

  const [filterStatus, setFilterStatus] = useState<
    ListDataExportWorkflowsFilterByStatusEnum | 'all'
  >('all');

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { dbServiceIDOptions, updateDbServiceList } = useDbService();
  const { memberOptions, updateMemberTips } = useMemberTips();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IListDataExportWorkflowWithExtraParams,
    ExportWorkflowListFilterParamType
  >();

  const columns = useMemo(() => {
    return ExportWorkflowListColumn(projectID);
  }, [projectID]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer<
      IListDataExportWorkflowWithExtraParams,
      ExportWorkflowListFilterParamType
    >(columns, updateTableFilterInfo, ExportWorkflowExtraFilterMeta());

  const tableSetting: ColumnsSettingProps = {
    tableName: 'export_workflow_list',
    username: username
  };

  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof IListDataExportWorkflowWithExtraParams,
      FilterCustomProps
    >([
      [
        'db_service_uid',
        {
          options: dbServiceIDOptions
        }
      ],
      ['created_at', { showTime: true }],
      ['exported_at', { showTime: true }],
      ['creater', { options: memberOptions }],
      ['current_step_assignee_user_list', { options: memberOptions }]
    ]);
  }, [dbServiceIDOptions, memberOptions]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: string[]) => {
      setSelectedRowKeys(keys);
    }
  };

  const [batchCloseConfirmLoading, setBatchCloseConfirmLoading] =
    useState<boolean>(false);

  const {
    data: exportWorkflowList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListDataExportWorkflowsParams = {
        ...tableFilterInfo,
        ...pagination,
        filter_by_status: filterStatus === 'all' ? undefined : filterStatus,
        project_uid: projectID,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(
        DataExportWorkflows.ListDataExportWorkflows(params)
      );
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterStatus]
    }
  );

  const batchCloseWorkflowAction = useCallback(() => {
    const canCancel: boolean = selectedRowKeys.every((e) => {
      const status = exportWorkflowList?.list?.filter(
        (data) => `${data.workflow_uid}` === e
      )[0]?.status;
      return (
        status === ListDataExportWorkflowStatusEnum.wait_for_approve ||
        status === ListDataExportWorkflowStatusEnum.rejected
      );
    });
    if (canCancel) {
      setBatchCloseConfirmLoading(true);

      DataExportWorkflows.CancelDataExportWorkflow({
        payload: {
          data_export_workflow_uids: selectedRowKeys
        },
        project_uid: projectID
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setSelectedRowKeys([]);
            refresh();
          }
        })
        .finally(() => {
          setBatchCloseConfirmLoading(false);
        });
    } else {
      messageApi.warning(
        t('dmsDataExport.batchCancel.messageWarn', {
          waitAudit: t('dmsDataExport.status.wait_for_audit'),
          reject: t('dmsDataExport.status.rejected')
        })
      );
    }
  }, [
    messageApi,
    projectID,
    selectedRowKeys,
    t,
    exportWorkflowList?.list,
    refresh
  ]);

  const tableToolbarActions = useMemo(() => {
    return parse2TableToolbarActionPermissions(
      DataExportManagementTableToolbarActions({
        disabled: selectedRowKeys.length === 0,
        loading: batchCloseConfirmLoading,
        batchCloseWorkflowAction
      })
    );
  }, [
    parse2TableToolbarActionPermissions,
    batchCloseConfirmLoading,
    selectedRowKeys,
    batchCloseWorkflowAction
  ]);

  useEffect(() => {
    updateDbServiceList({
      project_uid: projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });
    updateMemberTips({ project_uid: projectID });
  }, [projectID, updateDbServiceList, updateMemberTips]);

  return (
    <section>
      {messageContextHolder}
      <PageHeader
        title={t('dmsDataExport.pageTitle')}
        extra={DataExportManagementCreateAction(projectID)}
      />

      <ActiontechTableWrapper loading={loading} setting={tableSetting}>
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
          actions={tableToolbarActions}
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
          <WorkflowStatusFilter
            status={filterStatus}
            onChange={setFilterStatus}
          />
        </TableToolbar>

        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          disabled={loading}
          filterCustomProps={filterCustomProps}
        />

        <ActiontechTable
          className="table-row-cursor"
          dataSource={exportWorkflowList?.list}
          rowKey={(record: IListDataExportWorkflow) => {
            return `${record?.workflow_uid}`;
          }}
          rowSelection={
            checkActionPermission(
              PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.BATCH_CLOSE
            )
              ? (rowSelection as TableRowSelection<IListDataExportWorkflow>)
              : undefined
          }
          pagination={{
            total: exportWorkflowList?.total ?? 0,
            current: pagination.page_index
          }}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          onRow={(record) => {
            return {
              onClick() {
                navigate(ROUTE_PATHS.BASE.DATA_EXPORT.detail, {
                  params: { projectID, workflowID: record.workflow_uid ?? '' }
                });
              }
            };
          }}
        />
      </ActiontechTableWrapper>
    </section>
  );
};

export default ExportWorkflowList;
