import { t } from '../../../locale';
import { EmptyBox } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import OrderDesc from '../../Order/List/components/OrderDesc';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { DashboardNameStyleWrapper } from './style';
import { IconOrderName } from '../../../icon/Dashboard';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const commonColumn: (
  projectID: string
) => ActiontechTableColumn<IWorkflowDetailResV1> = (projectID) => {
  const column: ActiontechTableColumn<IWorkflowDetailResV1> = [
    {
      dataIndex: 'workflow_name',
      title: () => t('order.order.name'),
      className: 'dashboard-common-list-table-name-column',
      render: (text, record) => {
        return (
          <EmptyBox if={!!text && !!record.project_name} defaultNode={text}>
            <DashboardNameStyleWrapper>
              <IconOrderName />
              <Link
                to={`/sqle/project/${record.project_name}/order/${record.workflow_id}`}
              >
                {text}
              </Link>
            </DashboardNameStyleWrapper>
          </EmptyBox>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      className: 'dashboard-common-list-table-desc-column',
      render: (desc: string, record: IWorkflowDetailResV1) =>
        desc ? (
          <OrderDesc
            desc={desc}
            projectID={projectID}
            orderID={record.workflow_id ?? ''}
          />
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'create_time',
      title: () => t('order.order.createTime'),
      width: 260,
      render: (time) => {
        return formatTime(time, '-');
      }
    }
  ];

  return column;
};
