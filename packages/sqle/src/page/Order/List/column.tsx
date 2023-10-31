import {
  ActiontechTableColumn,
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import OrderStatus from './components/OrderStatus';
import { OrderNameStyleWrapper } from './style';
import { IconOrderId } from '../../../icon/Order';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { AvatarCom } from '@actiontech/shared';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

export type OrderListTableFilterParamType = PageInfoWithoutIndexAndSize<
  IGetWorkflowsV1Params,
  'project_name'
>;

export const ExtraFilterMeta: () => ActiontechTableFilterMeta<
  IWorkflowDetailResV1 & {
    instance_name?: string;
    execute_time?: string;
  },
  OrderListTableFilterParamType
> = () => {
  return new Map<
    keyof (IWorkflowDetailResV1 & {
      instance_name?: string;
      execute_time?: string;
    }),
    ActiontechTableFilterMetaValue<OrderListTableFilterParamType>
  >([
    [
      'execute_time',
      {
        filterCustomType: 'date-range',
        filterKey: [
          'filter_task_execute_start_time_from',
          'filter_task_execute_start_time_to'
        ],
        filterLabel: t('order.order.executeTime'),
        checked: false
      }
    ],

    [
      'instance_name',
      {
        filterCustomType: 'select',
        filterKey: 'filter_task_instance_name',
        filterLabel: t('order.order.dataSource'),
        checked: false
      }
    ]
  ]);
};

const OrderListColumn: (
  projectID: string
) => ActiontechTableColumn<
  IWorkflowDetailResV1,
  OrderListTableFilterParamType,
  'address'
> = (projectID) => {
  return [
    {
      dataIndex: 'workflow_id',
      title: () => t('order.order.id'),
      render: (id: string) => {
        return (
          <TableColumnWithIconStyleWrapper>
            <IconOrderId />
            <span>{id}</span>
          </TableColumnWithIconStyleWrapper>
        );
      },
      fixed: 'left'
    },
    {
      dataIndex: 'workflow_name',
      className: 'order-list-table-workflow-name-column',
      title: () => t('order.order.name'),
      render: (name: string) => (
        <OrderNameStyleWrapper ellipsis={true}>{name}</OrderNameStyleWrapper>
      ),
      fixed: 'left'
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      className: 'order-list-table-desc-column',
      render: (desc: string, record: IWorkflowDetailResV1) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: `/sqle/project/${projectID}/order/${
                record.workflow_id ?? ''
              }`,
              text: t('order.create.viewOrderDetail')
            }}
          />
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'create_time',
      title: () => t('order.order.createTime'),
      render: (time) => {
        return formatTime(time, '-');
      },
      filterCustomType: 'date-range',
      filterKey: ['filter_create_time_from', 'filter_create_time_to']
    },
    {
      dataIndex: 'create_user_name',
      title: () => t('order.order.createUser'),
      filterCustomType: 'select',
      filterKey: 'filter_create_user_id'
    },
    {
      dataIndex: 'status',
      title: () => t('order.order.status'),
      render: (status: IWorkflowDetailResV1['status']) => {
        return <OrderStatus status={status} />;
      }
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => t('order.order.assignee'),
      filterCustomType: 'select',
      filterKey: 'filter_current_step_assignee_user_id',
      render: (list: string[]) => {
        return list?.map((v) => {
          return <AvatarCom key={v} name={v} />;
        });
      }
    }
  ];
};

export default OrderListColumn;
