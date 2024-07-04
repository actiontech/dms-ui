import { t } from '../../../locale';
import { EmptyBox } from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled } from '@actiontech/icons';

export const commonColumn: (
  projectID: string
) => ActiontechTableColumn<IWorkflowDetailResV1> = (projectID) => {
  const column: ActiontechTableColumn<IWorkflowDetailResV1> = [
    {
      dataIndex: 'workflow_name',
      title: () => t('order.order.name'),
      className: 'dashboard-common-list-table-name-column',
      width: '30%',
      render: (text, record) => {
        return (
          <EmptyBox if={!!text && !!record.project_name} defaultNode={text}>
            <TableColumnWithIconStyleWrapper>
              <BriefcaseFilled width={14} height={14} />
              <Link
                to={`/sqle/project/${record.project_name}/exec-workflow/${record.workflow_id}`}
              >
                {text}
              </Link>
            </TableColumnWithIconStyleWrapper>
          </EmptyBox>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('order.order.desc'),
      className: 'dashboard-common-list-table-desc-column',
      width: '45%',
      render: (desc: string, record: IWorkflowDetailResV1) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: `/sqle/project/${projectID}/exec-workflow/${
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
      width: '25%',
      render: (time) => {
        return formatTime(time, '-');
      }
    }
  ];

  return column;
};
