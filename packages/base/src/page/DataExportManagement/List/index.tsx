import { PageHeader, BasicButton, EmptyBox } from '@actiontech/shared';
import {
  useTableRequestParams,
  TableToolbar,
  useTableRequestError,
  ColumnsSettingProps,
  useTableFilterContainer,
  TableFilterContainer,
  FilterCustomProps,
  ActiontechTable
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  ExportWorkflowExtraFilterMeta,
  ExportWorkflowListColumn,
  ExportWorkflowListFilterParamType
} from './column';
import { TableRowSelection } from 'antd/es/table/interface';
import WorkflowStatusFilter from './components/WorkflowStatusFilter';
import useDbService from '../../../hooks/useDbService';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IListDataExportWorkflowsParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import { IListDataExportWorkflow } from '@actiontech/shared/lib/api/base/service/common';
import {
  ListDBServiceTipsFunctionalModuleEnum,
  ListDataExportWorkflowsFilterByStatusEnum
} from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import useMemberTips from '../../../hooks/useMemberTips';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { MinusCircleOutlined } from '@actiontech/icons';
import { PlusOutlined } from '@ant-design/icons';

const ExportWorkflowList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID, projectArchive, projectName } = useCurrentProject();
  const { isAdmin, username, isProjectManager } = useCurrentUser();

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
    IListDataExportWorkflow,
    ExportWorkflowListFilterParamType
  >();

  const columns = useMemo(() => {
    return ExportWorkflowListColumn(projectID);
  }, [projectID]);

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(
      columns,
      updateTableFilterInfo,
      ExportWorkflowExtraFilterMeta()
    );

  const tableSetting: ColumnsSettingProps = {
    tableName: 'export_workflow_list',
    username: username
  };

  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (IListDataExportWorkflow & {
        db_service_uid?: string;
      }),
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

  const allowClose = isAdmin || isProjectManager(projectName);
  const [batchCloseConfirmLoading, setBatchCloseConfirmLoading] =
    useState<boolean>(false);

  const batchCloseWorkflowAction = () => {
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

      dms
        .CancelDataExportWorkflow({
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
  };

  useEffect(() => {
    updateDbServiceList({
      project_uid: projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });
    updateMemberTips({ project_uid: projectID });
  }, [projectID, updateDbServiceList, updateMemberTips]);

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
      return handleTableRequestError(dms.ListDataExportWorkflows(params));
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterStatus]
    }
  );

  return (
    <section>
      {messageContextHolder}
      <PageHeader
        title={t('dmsDataExport.pageTitle')}
        extra={
          <Space size={12}>
            <EmptyBox if={!projectArchive}>
              <Link to={`/project/${projectID}/data/export/create`}>
                <BasicButton
                  type="primary"
                  icon={
                    <PlusOutlined width={14} height={14} color="currentColor" />
                  }
                >
                  {t('dmsDataExport.create.button')}
                </BasicButton>
              </Link>
            </EmptyBox>
          </Space>
        }
      />

      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        setting={tableSetting}
        actions={[
          {
            key: 'close',
            text: t('dmsDataExport.batchClose.button'),
            buttonProps: {
              icon: (
                <MinusCircleOutlined
                  fill="currentColor"
                  width={14}
                  height={14}
                />
              ),
              disabled: selectedRowKeys?.length === 0,
              loading: batchCloseConfirmLoading
            },
            permissions: allowClose,
            confirm: {
              onConfirm: batchCloseWorkflowAction,
              title: t('dmsDataExport.batchClose.tips'),
              okButtonProps: {
                disabled: batchCloseConfirmLoading
              }
            }
          }
        ]}
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
        setting={tableSetting}
        dataSource={exportWorkflowList?.list}
        rowKey={(record: IListDataExportWorkflow) => {
          return `${record?.workflow_uid}`;
        }}
        rowSelection={
          allowClose
            ? (rowSelection as TableRowSelection<IListDataExportWorkflow>)
            : undefined
        }
        pagination={{
          total: exportWorkflowList?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        onRow={(record) => {
          return {
            onClick() {
              navigate(
                `/project/${projectID}/data/export/${record.workflow_uid}`
              );
            }
          };
        }}
      />
    </section>
  );
};

export default ExportWorkflowList;
