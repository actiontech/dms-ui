import { Handle, Position } from '@xyflow/react';
import {
  BasicButton,
  EmptyBox,
  BasicTypographyEllipsis
} from '@actiontech/shared';
import { Card, Space, Typography } from 'antd';
import type { Node, NodeProps } from '@xyflow/react';
import { StageNodeStyleWrapper } from '../../style';
import { Link } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import WorkflowStatus from '../../../../SqlExecWorkflow/List/components/WorkflowStatus';
import {
  WorkflowDetailResV1StatusEnum,
  WorkflowDetailWithInstanceStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { StageNodeData } from '../../index.type';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { SqlVersionDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const StageNode: React.FC<NodeProps<Node<StageNodeData>>> = ({
  data,
  isConnectable
}) => {
  const {
    isFirstStage,
    isLastStage,
    workflowList,
    onRetry,
    onOfflineExecute,
    onAssociateWorkflow,
    onCreateNewWorkflow,
    versionStatus
  } = data;

  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  return (
    <StageNodeStyleWrapper>
      <EmptyBox if={!isFirstStage}>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      </EmptyBox>
      <Space direction="vertical">
        {workflowList?.map((workflow, index) => {
          const isNoEmptyWorkflow = !!workflow?.workflow_id;
          return (
            <Card
              hoverable={isNoEmptyWorkflow}
              key={workflow?.workflow_id ?? index}
              className={classNames({
                'empty-card': !isNoEmptyWorkflow
              })}
            >
              {isNoEmptyWorkflow ? (
                <>
                  <Space className="card-header">
                    <Link
                      to={`/sqle/project/${projectID}/exec-workflow/${workflow.workflow_id}`}
                      target="__blank"
                      title={workflow.workflow_name}
                    >
                      {workflow.workflow_name}
                    </Link>
                    <WorkflowStatus
                      status={
                        workflow.status as unknown as WorkflowDetailResV1StatusEnum
                      }
                    />
                  </Space>
                  <Space className="card-content-item">
                    <Typography.Text type="secondary">
                      {t('versionManagement.stageNode.workflowDesc')}
                    </Typography.Text>
                    {workflow?.desc ? (
                      <BasicTypographyEllipsis textCont={workflow?.desc} />
                    ) : (
                      '-'
                    )}
                  </Space>
                  <Space className="card-content-item">
                    <Typography.Text type="secondary">
                      {t('versionManagement.stageNode.executeTime')}
                    </Typography.Text>
                    {formatTime(workflow.workflow_exec_time, '-')}
                  </Space>
                  <Space
                    className="card-action-wrap"
                    hidden={
                      workflow.status !==
                      WorkflowDetailWithInstanceStatusEnum.exec_failed
                    }
                  >
                    <BasicButton
                      size="small"
                      onClick={() => onRetry?.(workflow?.workflow_id ?? '')}
                    >
                      {t('versionManagement.stageNode.retry')}
                    </BasicButton>
                    <BasicButton
                      size="small"
                      onClick={() =>
                        onOfflineExecute?.(workflow.workflow_id ?? '')
                      }
                    >
                      {t('versionManagement.stageNode.offlineExecuted')}
                    </BasicButton>
                  </Space>
                </>
              ) : null}
            </Card>
          );
        })}
        <Space hidden={!isFirstStage} className="bottom-action-wrap">
          <BasicButton
            type="primary"
            onClick={() => onAssociateWorkflow?.(data.stageId ?? 0)}
            disabled={versionStatus === SqlVersionDetailResV1StatusEnum.locked}
          >
            {t('versionManagement.stageNode.addExistingWorkflow')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={onCreateNewWorkflow}
            disabled={versionStatus === SqlVersionDetailResV1StatusEnum.locked}
          >
            {t('versionManagement.stageNode.createWorkflow')}
          </BasicButton>
        </Space>
      </Space>
      <EmptyBox if={!isLastStage}>
        <Handle
          type="source"
          position={Position.Right}
          id="a"
          isConnectable={isConnectable}
        />
      </EmptyBox>
    </StageNodeStyleWrapper>
  );
};

export default StageNode;
