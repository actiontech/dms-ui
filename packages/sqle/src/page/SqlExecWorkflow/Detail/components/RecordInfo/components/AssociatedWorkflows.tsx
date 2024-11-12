import { Timeline, TimelineProps, Space } from 'antd';
import { IAssociatedStageWorkflows } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { useMemo } from 'react';
import WorkflowStatus from '../../../../List/components/WorkflowStatus';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import classNames from 'classnames';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import { EnvironmentFilled } from '@actiontech/icons';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const AssociatedWorkflows: React.FC<{
  associatedWorkflows?: IAssociatedStageWorkflows[];
  workflowId?: string;
}> = ({ workflowId, associatedWorkflows }) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const timelineItems: TimelineProps['items'] = useMemo(() => {
    return associatedWorkflows
      ?.sort((a, b) => (a?.stage_sequence ?? 0) - (b?.stage_sequence ?? 0))
      .map((workflow) => {
        const isCurrentWorkflow = workflow.workflow_id === workflowId;
        return {
          color: 'gray',
          dot: isCurrentWorkflow ? (
            <EnvironmentFilled width={24} height={24} />
          ) : null,
          children: (
            <Space
              direction="vertical"
              className={classNames('associated-workflows-wrap-item', {
                'associated-workflows-wrap-item-highlight': isCurrentWorkflow
              })}
            >
              {isCurrentWorkflow ? (
                workflow.workflow_name
              ) : (
                <TypedLink
                  to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                  params={{ projectID, workflowId: workflow.workflow_id ?? '' }}
                  target="__blank"
                >
                  {workflow.workflow_name}
                </TypedLink>
              )}
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
  }, [associatedWorkflows, t, projectID, workflowId]);

  return (
    <section className="associated-workflows-wrap">
      <div className="associated-workflows-wrap-title">
        {t('execWorkflow.detail.operator.associatedWorkflowInfo')}
      </div>
      <Timeline items={timelineItems} />
    </section>
  );
};

export default AssociatedWorkflows;
