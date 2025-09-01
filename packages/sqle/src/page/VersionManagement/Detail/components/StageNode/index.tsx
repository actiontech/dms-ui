import { Handle, Position } from '@xyflow/react';
import { BasicButton, EmptyBox } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis, TypedLink } from '@actiontech/shared';
import { Card, Space, Typography } from 'antd';
import type { Node, NodeProps } from '@xyflow/react';
import { StageNodeStyleWrapper } from '../../style';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import WorkflowStatus from '../../../../SqlExecWorkflow/List/components/WorkflowStatus';
import {
  WorkflowDetailResV1StatusEnum,
  WorkflowDetailWithInstanceStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { StageNodeData } from '../../index.type';
import { SqlVersionDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
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
  const displayWorkflow = useMemo(() => {
    // 版本初始化不存在工单时 统一展示一个空占位
    if (!workflowList?.length) {
      return [{}];
    }
    return workflowList;
  }, [workflowList]);
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
        {displayWorkflow.map((workflow, index) => {
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
                    <TypedLink
                      target="_blank"
                      to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                      params={{
                        projectID,
                        workflowId: workflow.workflow_id ?? ''
                      }}
                      title={workflow.workflow_name}
                    >
                      {workflow.workflow_name}
                    </TypedLink>
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
