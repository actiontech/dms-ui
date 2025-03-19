import {
  ActiontechTable,
  ColumnsSettingProps,
  FilterCustomProps,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams,
  ActiontechTableWrapper,
  TableFilterContainer,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import { SqlExecWorkflowListStyleWrapper } from './style';
import {
  PageHeader,
  CustomSegmentedFilter,
  useTypedNavigate
} from '@actiontech/shared';
import { Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission,
  PERMISSIONS
} from '@actiontech/shared/lib/features';
import ExportWorkflowButton from './components/ExportWorkflowButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  exportWorkflowV1FilterStatusEnum,
  getWorkflowsV1FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import useUsername from '../../../hooks/useUsername';
import useInstance from '../../../hooks/useInstance';
import { useRequest } from 'ahooks';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ExtraFilterMeta, SqlExecWorkflowListColumn } from './column';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { TableRowSelection } from 'antd/es/table/interface';
import { SqlExecWorkflowListTableFilterParam } from './index.type';
import {
  execWorkflowStatusDictionary,
  translateDictionaryI18nLabel
} from '../../../hooks/useStaticStatus/index.data';
import {
  SqlExecWorkflowCreateAction,
  SqlExecWorkflowTableToolbarActions
} from './action';
import useSQLVersionTips from '../../../hooks/useSQLVersionTips';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { WorkflowDetailResV1WithExtraParams } from './index.type';

const SqlExecWorkflowList: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectID, projectName } = useCurrentProject();
  const navigate = useTypedNavigate();
  const [filterStatus, setFilterStatus] =
    useState<getWorkflowsV1FilterStatusEnum>();
  const { usernameOptions, updateUsernameList } = useUsername();
  const { instanceIDOptions, updateInstanceList } = useInstance();
  const { username } = useCurrentUser();

  const { parse2TableToolbarActionPermissions, checkActionPermission } =
    usePermission();

  const { sqlVersionOptions, updateSqlVersionList } = useSQLVersionTips();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    IWorkflowDetailResV1,
    SqlExecWorkflowListTableFilterParam
  >();

  const {
    data: workflowList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetWorkflowsV1Params = {
        ...tableFilterInfo,
        ...pagination,
        filter_status: filterStatus,
        project_name: projectName,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(workflow.getWorkflowsV1(params));
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterStatus]
    }
  );

  const columns = useMemo(
    () => SqlExecWorkflowListColumn(projectID),
    [projectID]
  );
  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_exec_workflow_list',
      username: username
    }),
    [username]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const filterCustomProps = useMemo(() => {
    return new Map<keyof WorkflowDetailResV1WithExtraParams, FilterCustomProps>(
      [
        ['create_user_name', { options: usernameOptions }],
        ['current_step_assignee_user_name_list', { options: usernameOptions }],
        [
          'instance_name',
          {
            options: instanceIDOptions
          }
        ],
        [
          'create_time',
          {
            showTime: true
          }
        ],
        [
          'execute_time',
          {
            showTime: true
          }
        ],
        // #if [ee]
        ['sql_version_name', { options: sqlVersionOptions }]
        // #endif
      ]
    );
  }, [instanceIDOptions, usernameOptions, sqlVersionOptions]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: string[]) => {
      setSelectedRowKeys(keys);
    }
  };

  const batchCloseAction = useCallback(() => {
    const canCancel: boolean = selectedRowKeys.every((e) => {
      const status = workflowList?.list?.filter(
        (data) => `${data.workflow_id}` === e
      )[0]?.status;
      return (
        status === WorkflowDetailResV1StatusEnum.wait_for_audit ||
        status === WorkflowDetailResV1StatusEnum.wait_for_execution ||
        status === WorkflowDetailResV1StatusEnum.rejected
      );
    });
    if (canCancel) {
      setConfirmLoading(true);
      workflow
        .batchCancelWorkflowsV2({
          workflow_id_list: selectedRowKeys,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setSelectedRowKeys([]);
            refresh();
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      messageApi.warning(
        t('execWorkflow.list.batchClose.messageWarn', {
          process: t('execWorkflow.common.workflowStatus.process'),
          reject: t('execWorkflow.common.workflowStatus.reject')
        })
      );
    }
  }, [
    selectedRowKeys,
    workflowList?.list,
    projectName,
    refresh,
    messageApi,
    t
  ]);

  const toolbarActions = useMemo(() => {
    return parse2TableToolbarActionPermissions(
      SqlExecWorkflowTableToolbarActions({
        disabled: selectedRowKeys?.length === 0,
        loading: confirmLoading,
        batchCloseAction
      })
    );
  }, [
    batchCloseAction,
    confirmLoading,
    selectedRowKeys?.length,
    parse2TableToolbarActionPermissions
  ]);

  useEffect(() => {
    updateUsernameList({ filter_project: projectName });
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateUsernameList]);

  // #if [ee]
  useEffect(() => {
    updateSqlVersionList();
  }, [updateSqlVersionList]);
  // #endif

  return (
    <SqlExecWorkflowListStyleWrapper>
      {messageContextHolder}
      <PageHeader
        title={t('execWorkflow.list.pageTitle')}
        extra={
          <Space size={12}>
            {/* #if [ee] */}
            <ExportWorkflowButton
              filterStatus={
                filterStatus as unknown as exportWorkflowV1FilterStatusEnum
              }
              tableFilterInfo={tableFilterInfo}
              searchKeyword={searchKeyword}
            />
            {/* #endif */}

            {SqlExecWorkflowCreateAction(projectID)}
          </Space>
        }
      />
      <ActiontechTableWrapper loading={loading} setting={tableSetting}>
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
          actions={toolbarActions}
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
          <CustomSegmentedFilter
            value={filterStatus}
            onChange={setFilterStatus}
            labelDictionary={translateDictionaryI18nLabel(
              execWorkflowStatusDictionary
            )}
            options={Object.keys(getWorkflowsV1FilterStatusEnum)}
            withAll
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
          dataSource={workflowList?.list}
          rowKey={(record: IWorkflowDetailResV1) => {
            return `${record?.workflow_id}`;
          }}
          rowSelection={
            checkActionPermission(
              PERMISSIONS.ACTIONS.BASE.DATA_EXPORT.BATCH_CLOSE
            )
              ? (rowSelection as TableRowSelection<IWorkflowDetailResV1>)
              : undefined
          }
          pagination={{
            total: workflowList?.total ?? 0,
            current: pagination.page_index
          }}
          columns={columns}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          onRow={(record) => {
            return {
              onClick() {
                navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail, {
                  params: { workflowId: record.workflow_id ?? '', projectID }
                });
              }
            };
          }}
        />
      </ActiontechTableWrapper>
    </SqlExecWorkflowListStyleWrapper>
  );
};

export default SqlExecWorkflowList;
