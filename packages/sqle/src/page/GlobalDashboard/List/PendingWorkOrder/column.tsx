import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from '../../../../locale';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { BasicTypographyEllipsis, BasicToolTips } from '@actiontech/shared';
import WorkflowStatus from '../../../SqlExecWorkflow/List/components/WorkflowStatus';
import { Space, Typography } from 'antd';
import { ProjectPriorityDictionary } from '../../index.data';
import { ProjectProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { Link } from 'react-router-dom';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BriefcaseFilled } from '@actiontech/icons';

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
          <Link
            to={`/sqle/project/${record.project_uid}/exec-workflow/${record.workflow_id}`}
          >
            {name}
          </Link>
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
              route: `/sqle/project/${record.project_uid}/exec-workflow/${
                record.workflow_id ?? ''
              }`,
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
          <BasicToolTips
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
          </BasicToolTips>
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
          ? ProjectPriorityDictionary[priority as ProjectProjectPriorityEnum]
          : '-';
      }
    }
  ];
};
