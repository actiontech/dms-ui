import { Timeline, TimelineProps, Space, Typography } from 'antd';
import { useMemo } from 'react';
import WorkflowStatus from '../../../../List/components/WorkflowStatus';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { AssociatedRollbackWorkflowsProps } from '../index.type';

const AssociatedRollbackWorkflows: React.FC<
  AssociatedRollbackWorkflowsProps
> = ({ associatedWorkflows }) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const timelineItems: TimelineProps['items'] = useMemo(() => {
    return associatedWorkflows?.map((workflow) => {
      return {
        color: 'gray',
        children: (
          <Space
            direction="vertical"
            className="associated-workflows-wrap-item associated-workflows-wrap-item-highlight"
          >
            <Typography.Paragraph ellipsis title={workflow.workflow_name}>
              <TypedLink
                to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                params={{ projectID, workflowId: workflow.workflow_id ?? '' }}
                target="__blank"
              >
                {workflow.workflow_name}
              </TypedLink>
            </Typography.Paragraph>

            <Space>
              <span className="associated-workflows-wrap-item-label">
                {t('execWorkflow.list.status')}
              </span>
              <WorkflowStatus
                status={
                  workflow.status as unknown as WorkflowDetailResV1StatusEnum
                }
              />
            </Space>
          </Space>
        )
      };
    });
  }, [associatedWorkflows, t, projectID]);

  return (
    <section className="associated-workflows-wrap">
      <div className="associated-workflows-wrap-title">
        {t('execWorkflow.detail.operator.associatedRollbackWorkflowInfo')}
      </div>
      <Timeline items={timelineItems} />
    </section>
  );
};

export default AssociatedRollbackWorkflows;
