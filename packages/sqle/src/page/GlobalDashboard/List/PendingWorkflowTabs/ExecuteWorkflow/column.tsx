import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { t } from '../../../../../locale';
import { formatTime } from '@actiontech/dms-kit';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicToolTip } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis, TypedLink } from '@actiontech/shared';
import WorkflowStatus from '../../../../SqlExecWorkflow/List/components/WorkflowStatus';
import { Space, Typography } from 'antd';
import { ProjectPriorityDictionary } from '../../../index.data';
import { ProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { BriefcaseFilled } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';

export const GlobalDashboardPendingWorkflowListColumn: (
  onUpdateFilterValue: (projectId?: string, instanceId?: string) => void
) => ActiontechTableColumn<IWorkflowDetailResV1> = (onUpdateFilterValue) => {
  return [
    {
      dataIndex: 'status',
      title: t('globalDashboard.workflow.status'),
      render: (status) => {
        return <WorkflowStatus status={status} />;
      }
    },
    {
      dataIndex: 'workflow_name',
      title: t('globalDashboard.workflow.name'),
      render: (name, record) => (
        <TableColumnWithIconStyleWrapper>
          <BriefcaseFilled width={14} height={14} />
          <TypedLink
            to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
            params={{
              projectID: record.project_uid ?? '',
              workflowId: record.workflow_id ?? ''
            }}
          >
            {name}
          </TypedLink>
        </TableColumnWithIconStyleWrapper>
      )
    },
    {
      dataIndex: 'desc',
      title: t('globalDashboard.workflow.desc'),
      className: 'workflow-list-table-desc-column',
      render: (desc, record: IWorkflowDetailResV1) =>
        desc ? (
          <BasicTypographyEllipsis
            textCont={desc}
            linkData={{
              route: parse2ReactRouterPath(
                ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail,
                {
                  params: {
                    projectID: record.project_uid ?? '',
                    workflowId: record.workflow_id ?? ''
                  }
                }
              ),
              text: t('execWorkflow.create.createResult.viewWorkflowDetail')
            }}
          />
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'create_time',
      title: t('globalDashboard.workflow.createTime'),
      render: (time) => {
        return formatTime(time, '-');
      }
    },
    {
      dataIndex: 'instance_info',
      title: t('globalDashboard.pendingSql.column.instance'),
      render: (instances, record) => {
        if (!instances || !instances.length) {
          return '-';
        }
        return (
          <BasicToolTip
            title={
              instances.length > 1 ? (
                <Space wrap>
                  {instances.map((v) => (
                    <Typography.Link
                      key={v.instance_id}
                      onClick={() =>
                        onUpdateFilterValue(record.project_uid, v.instance_id)
                      }
                    >
                      {v.instance_name}
                    </Typography.Link>
                  ))}
                </Space>
              ) : null
            }
          >
            <Space>
              <Typography.Link
                onClick={() =>
                  onUpdateFilterValue(
                    record.project_uid,
                    instances[0].instance_id
                  )
                }
              >
                {instances[0].instance_name}
              </Typography.Link>
              {instances.length > 1 ? '...' : null}
            </Space>
          </BasicToolTip>
        );
      }
    },
    {
      dataIndex: 'project_name',
      title: t('globalDashboard.pendingSql.column.project'),
      render: (project_name, record) => {
        return (
          <Typography.Link
            onClick={() => onUpdateFilterValue(record.project_uid)}
          >
            {project_name}
          </Typography.Link>
        );
      }
    },
    {
      dataIndex: 'project_priority',
      title: t('globalDashboard.pendingSql.column.projectPriority'),
      render: (priority) => {
        return priority
          ? ProjectPriorityDictionary[priority as ProjectV2ProjectPriorityEnum]
          : '-';
      }
    }
  ];
};
