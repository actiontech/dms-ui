import { t } from '../../../locale';
import {
  BasicTypographyEllipsis,
  EmptyBox,
  TypedLink
} from '@actiontech/shared';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

// todo TypedLink 涉及其他组件，暂时不处理
export const commonColumn: (
  projectID: string
) => ActiontechTableColumn<IWorkflowDetailResV1> = (projectID) => {
  const column: ActiontechTableColumn<IWorkflowDetailResV1> = [
    {
      dataIndex: 'workflow_name',
      title: () => t('home.sqlExecWorkflow.name'),
      className: 'dashboard-common-list-table-name-column',
      width: '30%',
      render: (text, record) => {
        return (
          <EmptyBox if={!!text && !!record.project_name} defaultNode={text}>
            <TableColumnWithIconStyleWrapper>
              <BriefcaseFilled width={14} height={14} />
              <TypedLink
                to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                params={{ projectID, workflowId: record.workflow_id ?? '' }}
              >
                {text}
              </TypedLink>
            </TableColumnWithIconStyleWrapper>
          </EmptyBox>
        );
      }
    },
    {
      dataIndex: 'desc',
      title: () => t('home.sqlExecWorkflow.desc'),
      className: 'dashboard-common-list-table-desc-column',
      width: '45%',
      render: (desc, record) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: `/sqle/project/${projectID}/exec-workflow/${
                record.workflow_id ?? ''
              }`,
              text: t('home.sqlExecWorkflow.viewDetail')
            }}
          />
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'create_time',
      title: () => t('home.sqlExecWorkflow.createTime'),
      width: '25%',
      render: (time) => {
        return formatTime(time, '-');
      }
    }
  ];

  return column;
};
