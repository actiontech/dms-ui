import {
  BasicTag,
  BasicTagProps,
  CustomAvatar,
  ROUTE_PATHS
} from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { IGlobalWorkflowListItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { GlobalDashboardWorkflowTableFilterParam } from './index.type';
import { TableColumnWithIconStyleWrapper } from '@actiontech/dms-kit';
import { FlagFilled } from '@actiontech/icons';
import { t } from '../../../../locale';
import {
  GlobalWorkflowListItemStatusEnum,
  GlobalWorkflowListItemWorkflowTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { workflowTypeLabelDictionary } from './data';

const getPriorityTagColor = (priority?: string) => {
  const p = priority?.toLowerCase();
  if (p === 'high') {
    return 'red';
  }
  if (p === 'medium') {
    return 'orange';
  }
  if (p === 'low') {
    return 'default';
  }
  return 'default';
};

const getPriorityLabel = (priority?: string) => {
  const p = priority?.toLowerCase();
  if (p === 'high') {
    return t('globalDashboard.high');
  }
  if (p === 'medium') {
    return t('globalDashboard.medium');
  }
  if (p === 'low') {
    return t('globalDashboard.low');
  }
  return priority ?? '-';
};

const getStatusTagLabel = (status?: GlobalWorkflowListItemStatusEnum) => {
  if (status === GlobalWorkflowListItemStatusEnum.pending_approval) {
    return t('globalDashboard.workflow.statusLabel.pending_approval');
  }
  if (status === GlobalWorkflowListItemStatusEnum.pending_action) {
    return t('globalDashboard.workflow.statusLabel.pending_action');
  }
  if (status === GlobalWorkflowListItemStatusEnum.in_progress) {
    return t('globalDashboard.workflow.statusLabel.in_progress');
  }
  if (status === GlobalWorkflowListItemStatusEnum.exporting) {
    return t('globalDashboard.workflow.statusLabel.exporting');
  }
  if (status === GlobalWorkflowListItemStatusEnum.rejected) {
    return t('globalDashboard.workflow.statusLabel.rejected');
  }
  if (status === GlobalWorkflowListItemStatusEnum.cancelled) {
    return t('globalDashboard.workflow.statusLabel.cancelled');
  }
  if (status === GlobalWorkflowListItemStatusEnum.failed) {
    return t('globalDashboard.workflow.statusLabel.failed');
  }
  if (status === GlobalWorkflowListItemStatusEnum.completed) {
    return t('globalDashboard.workflow.statusLabel.completed');
  }
  if (status === GlobalWorkflowListItemStatusEnum.unknown) {
    return t('globalDashboard.workflow.statusLabel.unknown');
  }
  return '-';
};

const getStatusTagColor = (
  status?: GlobalWorkflowListItemStatusEnum
): BasicTagProps['color'] => {
  if (status === GlobalWorkflowListItemStatusEnum.pending_approval) {
    return 'geekblue';
  }
  if (status === GlobalWorkflowListItemStatusEnum.pending_action) {
    return 'geekblue';
  }
  if (status === GlobalWorkflowListItemStatusEnum.in_progress) {
    return 'cyan';
  }
  if (status === GlobalWorkflowListItemStatusEnum.exporting) {
    return 'cyan';
  }
  if (status === GlobalWorkflowListItemStatusEnum.rejected) {
    return 'red';
  }
  if (status === GlobalWorkflowListItemStatusEnum.cancelled) {
    return 'red';
  }
  if (status === GlobalWorkflowListItemStatusEnum.failed) {
    return 'red';
  }
  if (status === GlobalWorkflowListItemStatusEnum.completed) {
    return 'green';
  }
  if (status === GlobalWorkflowListItemStatusEnum.unknown) {
    return 'gray';
  }
  return 'default';
};

const getWorkflowTypeColor = (
  workflowType?: GlobalWorkflowListItemWorkflowTypeEnum
): BasicTagProps['color'] => {
  if (workflowType === GlobalWorkflowListItemWorkflowTypeEnum.sql_release) {
    return 'green';
  }
  if (workflowType === GlobalWorkflowListItemWorkflowTypeEnum.data_export) {
    return 'blue';
  }
  return 'default';
};

export const workflowPanelColumns = (): ActiontechTableColumn<
  IGlobalWorkflowListItem,
  GlobalDashboardWorkflowTableFilterParam
> => {
  return [
    {
      dataIndex: 'workflow_name',
      title: t('globalDashboard.workflow.column.name'),
      className: 'ellipsis-column-width',
      render: (name, record) => {
        const projectID = record.project_uid ?? '';
        const workflowId = record.workflow_id ?? '';
        if (
          record.workflow_type ===
          GlobalWorkflowListItemWorkflowTypeEnum.data_export
        ) {
          return (
            <TypedLink
              to={ROUTE_PATHS.BASE.DATA_EXPORT.detail}
              params={{
                projectID,
                workflowID: workflowId
              }}
              target="__blank"
            >
              {name}
            </TypedLink>
          );
        }
        return (
          <TypedLink
            to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
            params={{
              projectID,
              workflowId
            }}
            target="__blank"
          >
            {name}
          </TypedLink>
        );
      }
    },
    {
      dataIndex: 'workflow_type',
      title: t('globalDashboard.workflow.column.type'),
      render: (workflowType) =>
        workflowType ? (
          <BasicTag color={getWorkflowTypeColor(workflowType)}>
            {workflowTypeLabelDictionary()[workflowType]}
          </BasicTag>
        ) : (
          <span>-</span>
        )
    },
    {
      dataIndex: 'project_name',
      title: t('globalDashboard.workflow.column.project'),
      render: (projectName) => {
        if (!projectName) {
          return '-';
        }
        return (
          <TableColumnWithIconStyleWrapper>
            <FlagFilled width={14} height={14} />
            {projectName}
          </TableColumnWithIconStyleWrapper>
        );
      }
    },
    {
      dataIndex: 'instance_name',
      title: t('globalDashboard.workflow.column.instance'),
      render: (instanceName) => {
        if (!instanceName) {
          return '-';
        }
        return instanceName;
      }
    },
    {
      dataIndex: 'assignee',
      title: t('globalDashboard.workflow.column.assignee'),
      render: (assignee) => {
        if (!assignee) {
          return '-';
        }
        return <CustomAvatar name={assignee} />;
      }
    },
    {
      dataIndex: 'priority',
      title: t('globalDashboard.workflow.column.priority'),
      render: (priority) =>
        priority ? (
          <BasicTag color={getPriorityTagColor(priority)}>
            {getPriorityLabel(priority)}
          </BasicTag>
        ) : (
          '-'
        )
    },
    {
      dataIndex: 'status',
      title: t('globalDashboard.workflow.column.status'),
      render: (status) =>
        status ? (
          <BasicTag color={getStatusTagColor(status)}>
            {getStatusTagLabel(status)}
          </BasicTag>
        ) : (
          '-'
        )
    }
  ];
};
