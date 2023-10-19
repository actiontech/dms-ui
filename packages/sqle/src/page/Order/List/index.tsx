import OrderListColumn, {
  ExtraFilterMeta,
  type OrderListTableFilterParamType
} from './column';
import { useBoolean, useRequest } from 'ahooks';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import useUsername from '../../../hooks/useUsername';
import { Space, message } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import useInstance from '../../../hooks/useInstance';
import OrderStatusFilter from './components/OrderStatusFilter';
import { ResponseCode } from '../../../data/common';
import { TableRowSelection } from 'antd5/es/table/interface';
import { OrderListStyleWrapper } from './style';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconAdd, IconDownload } from '@actiontech/shared/lib/Icon';
import { IconMinus } from '../../../icon/Order';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  IGetWorkflowsV1Params,
  IExportWorkflowV1Params
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import {
  getWorkflowsV1FilterStatusEnum,
  exportWorkflowV1FilterStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { Link, useNavigate } from 'react-router-dom';

const OrderList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const [filterStatus, setFilterStatus] = useState<
    getWorkflowsV1FilterStatusEnum | 'all'
  >('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const { usernameOptions, updateUsernameList } = useUsername();
  const { instanceOptions, updateInstanceList } = useInstance();
  const { isAdmin, username } = useCurrentUser();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { tableFilterInfo, updateTableFilterInfo, tableChange, pagination } =
    useTableRequestParams<
      IWorkflowDetailResV1,
      OrderListTableFilterParamType
    >();

  const {
    data: orderList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetWorkflowsV1Params = {
        ...tableFilterInfo,
        ...pagination,
        filter_status: filterStatus === 'all' ? undefined : filterStatus,
        project_name: projectName,
        fuzzy_keyword: searchKeyword
      };
      return handleTableRequestError(workflow.getWorkflowsV1(params));
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterStatus, searchKeyword]
    }
  );

  const columns = useMemo(() => OrderListColumn(projectID), [projectID]);
  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'order_list',
      username: username
    }),
    [username]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const filterCustomProps = useMemo(() => {
    return new Map<
      keyof (IWorkflowDetailResV1 & {
        instance_name?: string;
        execute_time?: string;
      }),
      FilterCustomProps
    >([
      ['create_user_name', { options: usernameOptions }],
      ['current_step_assignee_user_name_list', { options: usernameOptions }],
      [
        'instance_name',
        {
          options: instanceOptions
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
      ]
    ]);
  }, [instanceOptions, usernameOptions]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const onSearch = (value: string) => {
    setSearchKeyword(value);
  };

  // IFTRUE_isEE
  const [
    exportButtonDisabled,
    { setFalse: finishExport, setTrue: startExport }
  ] = useBoolean(false);
  const exportOrder = () => {
    startExport();
    const hideLoading = message.loading(t('order.exportOrder.exporting'));

    const {
      filter_create_time_from,
      filter_create_time_to,
      filter_task_execute_start_time_from,
      filter_task_execute_start_time_to,
      filter_create_user_id,
      filter_current_step_assignee_user_id,
      filter_subject,
      filter_task_instance_name
    } = tableFilterInfo;

    const params: IExportWorkflowV1Params = {
      ...tableFilterInfo,
      project_name: projectName,
      filter_create_user_id,
      filter_current_step_assignee_user_id,
      filter_status:
        filterStatus === 'all'
          ? undefined
          : (filterStatus as unknown as exportWorkflowV1FilterStatusEnum),
      filter_subject,
      filter_task_instance_name,
      filter_create_time_from,
      filter_create_time_to,
      filter_task_execute_start_time_from,
      filter_task_execute_start_time_to,
      fuzzy_keyword: searchKeyword
    };

    workflow
      .exportWorkflowV1(params, { responseType: 'blob' })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('order.exportOrder.exportSuccessTips'));
        }
      })
      .finally(() => {
        hideLoading();
        finishExport();
      });
  };
  // FITRUE_isEE

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: string[]) => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const batchCancel = useCallback(() => {
    const canCancel: boolean = selectedRowKeys.every((e) => {
      const status = orderList?.list?.filter(
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
      message.warning(
        t('order.batchCancel.messageWarn', {
          process: t('order.status.process'),
          reject: t('order.status.reject')
        })
      );
    }
  }, [selectedRowKeys, orderList?.list, projectName, refresh, t]);

  useEffect(() => {
    updateUsernameList();
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList, updateUsernameList]);

  return (
    <OrderListStyleWrapper>
      <PageHeader
        title={t('order.orderList.pageTitle')}
        extra={
          <Space size={12}>
            {/* IFTRUE_isEE */}
            <BasicButton
              onClick={exportOrder}
              disabled={exportButtonDisabled}
              icon={<IconDownload />}
            >
              {t('order.exportOrder.buttonText')}
            </BasicButton>
            {/* FITRUE_isEE */}

            <EmptyBox if={!projectArchive}>
              <Link to={`/sqle/project/${projectID}/order/create`}>
                <BasicButton type="primary" icon={<IconAdd />}>
                  {t('order.createOrder.title')}
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
            text: t('order.batchCancel.batchDelete'),
            buttonProps: {
              icon: <IconMinus />,
              disabled: selectedRowKeys?.length === 0
            },
            permissions: !!isAdmin,
            confirm: {
              onConfirm: batchCancel,
              title: t('order.batchCancel.cancelPopTitle'),
              okButtonProps: {
                disabled: confirmLoading
              }
            }
          }
        ]}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onSearch
        }}
        loading={loading}
      >
        <OrderStatusFilter status={filterStatus} onChange={setFilterStatus} />
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
        dataSource={orderList?.list}
        rowKey={(record: IWorkflowDetailResV1) => {
          return `${record?.workflow_id}`;
        }}
        rowSelection={
          isAdmin
            ? (rowSelection as TableRowSelection<IWorkflowDetailResV1>)
            : undefined
        }
        pagination={{
          total: orderList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        onRow={(record) => {
          return {
            onClick() {
              navigate(
                `/sqle/project/${projectID}/order/${record.workflow_id}`
              );
            }
          };
        }}
      />
    </OrderListStyleWrapper>
  );
};

export default OrderList;
