import {
  PageHeader,
  EmptyBox,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import RefreshButton from '@actiontech/shared/lib/components/ActiontechTable/components/RefreshButton';
import BackToList from '../Common/BackToList';
import { useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  type Node,
  type Edge,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { VersionDetailStyleWrapper } from './style';
import StageNode from './components/StageNode';
import ButtonEdge from './components/CustomEdge';
import CustomActionNode from './components/CustomActionNode';
import { useBoolean } from 'ahooks';
import ModifyWorkflowSql from './components/ModifyWorkflowSql';
import { useDispatch } from 'react-redux';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageId,
  updateSelectVersionStageWorkflowList,
  updateSelectWorkflowId
} from '../../../store/versionManagement';
import { updateVersionFirstStageInstances } from '../../../store/sqlExecWorkflow';
import { ModalName } from '../../../data/ModalName';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useRequest } from 'ahooks';
import {
  useCurrentProject,
  useCurrentUser,
  usePermission
} from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Spin, Space } from 'antd';
import {
  IWorkflowDetailWithInstance,
  IVersionStageInstance
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  WorkflowDetailWithInstanceStatusEnum,
  WorkflowDetailWithInstanceWorkflowReleaseStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import VersionDetailModals from './Modals';
import { StageNodeData, CustomEdgeData } from './index.type';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const VersionDetail = () => {
  const dispatch = useDispatch();

  const navigate = useTypedNavigate();

  const { versionId } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.detail>();

  const { projectName, projectID } = useCurrentProject();

  const { userRoles } = useCurrentUser();

  const { checkDbServicePermission } = usePermission();

  const [nodes, setNodes] = useState<Node<StageNodeData>[]>([]);

  const [edges, setEdges] = useState<Edge<CustomEdgeData>[]>([]);

  const [
    modifyWorkflowSqlStatement,
    {
      setTrue: showModifySqlStatementStep,
      setFalse: hideModifyWorkflowSqlStatement
    }
  ] = useBoolean();

  const onRetry = (id: string) => {
    dispatch(updateSelectWorkflowId({ workflowId: id }));
    showModifySqlStatementStep();
  };

  const onRelease = (
    stageId: number,
    workflowList: IWorkflowDetailWithInstance[]
  ) => {
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Release_Modal,
        status: true
      })
    );
    dispatch(updateSelectVersionStageId({ stageId }));
    const finishedWorkflowList: IWorkflowDetailWithInstance[] = [];
    workflowList
      .filter(
        (i) =>
          i.workflow_release_status ===
          WorkflowDetailWithInstanceWorkflowReleaseStatusEnum.wait_for_release
      )
      .some((i) => {
        if (
          i.status !== WorkflowDetailWithInstanceStatusEnum.finished &&
          i.status !== WorkflowDetailWithInstanceStatusEnum.canceled
        ) {
          return true;
        }
        if (i.status === WorkflowDetailWithInstanceStatusEnum.finished) {
          finishedWorkflowList.push(i);
        }
        return false;
      });
    dispatch(
      updateSelectVersionStageWorkflowList({
        workflowList: finishedWorkflowList
      })
    );
  };

  const onExecute = (workflowList: IWorkflowDetailWithInstance[]) => {
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Execute_Modal,
        status: true
      })
    );
    const finishedWorkflowList: IWorkflowDetailWithInstance[] = [];
    workflowList
      .filter((i) => i.status !== WorkflowDetailWithInstanceStatusEnum.finished)
      .some((i) => {
        if (
          i.status !==
            WorkflowDetailWithInstanceStatusEnum.wait_for_execution &&
          i.status !== WorkflowDetailWithInstanceStatusEnum.canceled
        ) {
          return true;
        }
        if (
          i.status === WorkflowDetailWithInstanceStatusEnum.wait_for_execution
        ) {
          finishedWorkflowList.push(i);
        }
        return false;
      });
    dispatch(
      updateSelectVersionStageWorkflowList({
        workflowList: finishedWorkflowList
      })
    );
  };

  const onAssociateWorkflow = (stageId: number) => {
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Associate_Workflow_Modal,
        status: true
      })
    );

    dispatch(updateSelectVersionStageId({ stageId }));
  };

  const onOfflineExecute = (id: string) => {
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Offline_Execute_Modal,
        status: true
      })
    );

    dispatch(updateSelectWorkflowId({ workflowId: id }));
  };

  const onCreateNewWorkflow = (
    id?: number,
    name?: string,
    stageInstance?: IVersionStageInstance[]
  ) => {
    dispatch(
      updateVersionFirstStageInstances({
        versionFirstStageInstances: stageInstance ?? []
      })
    );
    navigate(ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create, {
      params: { projectID },
      queries: {
        version_id: id?.toString() ?? '',
        version_name: encodeURIComponent(name ?? '')
      }
    });
  };

  const {
    data: versionDetail,
    loading: getVersionDetailLoading,
    refresh
  } = useRequest(
    () =>
      sqlVersion
        .getSqlVersionDetailV1({
          sql_version_id: versionId ?? '',
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }),
    {
      onSuccess: (res) => {
        const {
          sql_version_stage_detail = [],
          sql_version_id,
          version,
          status
        } = res ?? {};
        const sortedStageDetail = sql_version_stage_detail.sort(
          (a, b) => (a?.stage_sequence ?? 0) - (b?.stage_sequence ?? 0)
        );
        const stageNameNodes: Node<StageNodeData>[] = [];
        const stageWorkflowNodes: Node<StageNodeData>[] = [];
        const stageActionNodes: Node<StageNodeData>[] = [];
        const nodeEdges: Edge<CustomEdgeData>[] = [];

        // 工单数量以版本第一阶段的工单数量为基准 如果第一阶段存在10个工单 则后面的阶段工单数量也为10 不存在则展示占位
        const firstStageWorkflows =
          sortedStageDetail[0]?.workflow_details?.sort(
            (a, b) => (a?.workflow_sequence ?? 0) - (b?.workflow_sequence ?? 0)
          ) ?? [];
        sortedStageDetail.forEach((stage, index) => {
          const isFirstStage = index === 0;
          const isLastStage = index === sortedStageDetail.length - 1;
          const getNameNodeType = () => {
            if (isFirstStage) {
              return 'input';
            }

            if (isLastStage) {
              return 'output';
            }

            return undefined;
          };
          stageNameNodes.push({
            id: `${stage.stage_id}`,
            type: getNameNodeType(),
            data: {
              label: stage.stage_name,
              stageId: stage.stage_id ?? 0
            },
            position: { x: index * 530, y: 0 },
            sourcePosition: !isLastStage ? Position.Right : undefined,
            targetPosition: !isFirstStage ? Position.Left : undefined
          });

          // 如果某一个待上线的工单前都是已经上线或者已经关闭的工单 则允许批量上线
          const allowExecute = (
            workflowList: IWorkflowDetailWithInstance[]
          ) => {
            // 排除占位工单
            if (
              workflowList.filter((i) => !!i.status && !!i.workflow_id)
                .length === 0
            ) {
              return false;
            }
            const waitForExecuteWorkflowIndex = workflowList.findIndex(
              (i) =>
                i.status ===
                WorkflowDetailWithInstanceStatusEnum.wait_for_execution
            );
            if (waitForExecuteWorkflowIndex === -1) {
              return false;
            }
            const waitForExecuteWorkflowUpperList = workflowList.slice(
              0,
              waitForExecuteWorkflowIndex
            );

            if (waitForExecuteWorkflowUpperList.length === 0) {
              return true;
            }
            return !waitForExecuteWorkflowUpperList.some((i) => {
              if (
                !!i.status &&
                !!i.workflow_id &&
                i.status !== WorkflowDetailWithInstanceStatusEnum.canceled &&
                i.status !== WorkflowDetailWithInstanceStatusEnum.finished
              ) {
                return true;
              }

              return false;
            });
          };

          stageActionNodes.push({
            id: `${stage.stage_id}_actionNode`,
            type: 'actionNode',
            position: { x: index * 530, y: 40 },
            data: {
              stageId: stage.stage_id ?? 0,
              onExecute: !!stage.workflow_details?.length
                ? () => onExecute(stage.workflow_details ?? [])
                : undefined,
              allowExecute: allowExecute(stage.workflow_details ?? [])
            }
          });

          // 根据第一阶段的工单进行排序和填充占位
          const stageWorkflows = () => {
            return firstStageWorkflows.map((workflow) => {
              const currentSequenceWorkflow = stage.workflow_details?.find(
                (i) => i.workflow_sequence === workflow.workflow_sequence
              );
              if (!!currentSequenceWorkflow) {
                return currentSequenceWorkflow;
              }

              return { workflow_sequence: workflow.workflow_sequence };
            });
          };

          stageWorkflowNodes.push({
            id: `${stage.stage_id}_workflowNode`,
            type: 'stageNode',
            data: {
              isFirstStage,
              isLastStage,
              onRetry,
              onAssociateWorkflow,
              onOfflineExecute,
              onCreateNewWorkflow: () =>
                onCreateNewWorkflow(
                  sql_version_id,
                  version,
                  stage.stage_instances
                ),
              stageId: stage.stage_id ?? 0,
              workflowList: isFirstStage
                ? firstStageWorkflows
                : stageWorkflows(),
              showReleaseButton:
                !isLastStage && !!stage.workflow_details?.length,
              versionStatus: status
            },
            position: { x: index * 530, y: 78 }
          });
        });

        stageNameNodes.forEach((node, index) => {
          if (index !== stageNameNodes.length - 1) {
            nodeEdges.push({
              id: `${node.id}_edge`,
              source: `${node.id}`,
              target: `${stageNameNodes[index + 1].id}`
            });
          }
        });

        const allowRelease = (workflowList: IWorkflowDetailWithInstance[]) => {
          if (workflowList.filter((i) => !!i.status).length === 0) {
            return false;
          }
          // 当前阶段排除已发布的工单列表
          const exceptReleasedWorkflows = workflowList.filter(
            (i) =>
              i.workflow_release_status ===
              WorkflowDetailWithInstanceWorkflowReleaseStatusEnum.wait_for_release
          );

          // 如果某一个上线成功的工单前的工单都是已关闭 允许发布 其他状态都会阻塞工单的发布顺序
          const finishedWorkflowIndex = exceptReleasedWorkflows.findIndex(
            (i) => i.status === WorkflowDetailWithInstanceStatusEnum.finished
          );

          if (finishedWorkflowIndex === -1) {
            return false;
          }

          const finishedWorkflowUpperList = exceptReleasedWorkflows.slice(
            0,
            finishedWorkflowIndex
          );

          if (finishedWorkflowUpperList.length === 0) {
            return true;
          }
          return !finishedWorkflowUpperList.some((i) => {
            if (
              !!i.status &&
              !!i.workflow_id &&
              i.status !== WorkflowDetailWithInstanceStatusEnum.canceled
            ) {
              return true;
            }
            return false;
          });
        };

        const hasNextStageCreateWorkflowPermission = (stageId: number) => {
          const currentStageIndex = sortedStageDetail.findIndex(
            (i) => i.stage_id === stageId
          );
          if (currentStageIndex === sortedStageDetail.length - 1) {
            return false;
          }
          const nextStageInstance =
            sortedStageDetail[currentStageIndex + 1]?.stage_instances;
          return nextStageInstance?.some((i) =>
            checkDbServicePermission(
              OpPermissionItemOpPermissionTypeEnum.create_workflow,
              i.instances_id
            )
          );
        };
        stageWorkflowNodes.forEach((node, index) => {
          if (index !== stageWorkflowNodes.length - 1) {
            nodeEdges.push({
              id: `${node.id}_edge`,
              source: `${node.id}`,
              target: `${stageWorkflowNodes[index + 1].id}`,
              type: 'buttonEdge',
              data: {
                onRelease: node.data.showReleaseButton
                  ? () =>
                      onRelease(node.data.stageId, node.data.workflowList ?? [])
                  : undefined,
                allowRelease:
                  (userRoles.admin ||
                    userRoles.systemAdministrator ||
                    hasNextStageCreateWorkflowPermission(node.data.stageId)) &&
                  allowRelease(node.data.workflowList ?? [])
              }
            });
          }
        });

        setNodes([
          ...stageNameNodes,
          ...stageWorkflowNodes,
          ...stageActionNodes
        ]);
        setEdges(nodeEdges);
      }
    }
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Version_Management_Detail,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <>
      <EmptyBox
        if={!modifyWorkflowSqlStatement}
        defaultNode={
          <ModifyWorkflowSql
            hideModifyWorkflowSqlStatement={hideModifyWorkflowSqlStatement}
          />
        }
      >
        <VersionDetailStyleWrapper hidden={modifyWorkflowSqlStatement}>
          <PageHeader
            title={
              <Space>
                {versionDetail?.version}
                <RefreshButton refresh={refresh} noBorderIcon />
              </Space>
            }
            extra={<BackToList />}
          />
          <Spin
            spinning={getVersionDetailLoading}
            wrapperClassName="flow-wrapper"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={{
                stageNode: StageNode,
                actionNode: CustomActionNode
              }}
              edgeTypes={{
                buttonEdge: ButtonEdge
              }}
              snapToGrid={true}
              fitView
              attributionPosition="bottom-left"
              nodesDraggable={false}
              nodesConnectable={false}
            >
              <Controls showInteractive={false} />
            </ReactFlow>
          </Spin>
        </VersionDetailStyleWrapper>
      </EmptyBox>
      <VersionDetailModals />
    </>
  );
};

export default VersionDetail;
