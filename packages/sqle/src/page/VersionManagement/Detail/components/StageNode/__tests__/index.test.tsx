import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import StageNode from '../index';
import { StageNodeData } from '../../../index.type';
import {
  WorkflowDetailWithInstanceStatusEnum,
  SqlVersionDetailResV1StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ReactFlowProvider } from '@xyflow/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/VersionManagement/Detail/StageNode', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (data: Omit<StageNodeData, 'stageId'>) => {
    return sqleSuperRender(
      <ReactFlowProvider>
        <StageNode
          id="test-custom-action-node"
          type="action-node"
          dragging
          selectable
          deletable
          draggable
          selected
          isConnectable={false}
          positionAbsoluteX={0}
          positionAbsoluteY={0}
          zIndex={0}
          data={{
            stageId: 1,
            workflowList: [
              {
                workflow_name: 'DEV1_20241021103951',
                workflow_id: '12345678',
                workflow_sequence: 1,
                status: WorkflowDetailWithInstanceStatusEnum.finished,
                workflow_exec_time: '2024-10-21T14:42:42.348+08:00',
                workflow_instances: [
                  {
                    instances_id: '123456',
                    instances_name: 'DEV1',
                    instance_schema: 'test'
                  }
                ]
              }
            ],
            ...data
          }}
        />
      </ReactFlowProvider>
    );
  };

  it('render stage node when isFirstStage and isLastStage is all false', async () => {
    const { baseElement } = customRender({
      isFirstStage: false,
      isLastStage: false
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.bottom-action-wrap')).not.toBeVisible();
  });

  it('render stage node when isFirstStage is true', async () => {
    const onAssociateWorkflowSpy = jest.fn();
    const onCreateNewWorkflowSpy = jest.fn();
    const { baseElement } = customRender({
      isFirstStage: true,
      isLastStage: false,
      onAssociateWorkflow: onAssociateWorkflowSpy,
      onCreateNewWorkflow: onCreateNewWorkflowSpy
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.bottom-action-wrap')).toBeVisible();
    expect(
      screen.getByText('添加已有工单').closest('button')
    ).not.toBeDisabled();
    expect(screen.getByText('创建新工单').closest('button')).not.toBeDisabled();

    fireEvent.click(screen.getByText('添加已有工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onAssociateWorkflowSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('创建新工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(onCreateNewWorkflowSpy).toHaveBeenCalledTimes(1);
  });

  it('render stage node when isFirstStage is true and version status is locked', async () => {
    const { baseElement } = customRender({
      isFirstStage: true,
      isLastStage: false,
      versionStatus: SqlVersionDetailResV1StatusEnum.locked
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.bottom-action-wrap')).toBeVisible();
    expect(screen.getByText('添加已有工单').closest('button')).toBeDisabled();
    expect(screen.getByText('创建新工单').closest('button')).toBeDisabled();
  });

  it('render stage node when isLastStage is true', async () => {
    const { baseElement } = customRender({
      isFirstStage: false,
      isLastStage: true
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.bottom-action-wrap')).not.toBeVisible();
  });

  it('render stage node when workflow list is empty', async () => {
    const { baseElement } = customRender({
      isFirstStage: false,
      isLastStage: true,
      workflowList: []
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.empty-card')).toBeVisible();
  });

  it('render stage node when workflow status is failed', async () => {
    const retrySpy = jest.fn();
    const offlineExecuteSpy = jest.fn();
    const { baseElement } = customRender({
      isFirstStage: true,
      isLastStage: false,
      workflowList: [
        {
          workflow_name: 'DEV1_20241021103951',
          workflow_id: '12345678',
          workflow_sequence: 1,
          status: WorkflowDetailWithInstanceStatusEnum.exec_failed,
          workflow_exec_time: '2024-10-21T14:42:42.348+08:00',
          workflow_instances: [
            {
              instances_id: '123456',
              instances_name: 'DEV1',
              instance_schema: 'test'
            }
          ]
        }
      ],
      onRetry: retrySpy,
      onOfflineExecute: offlineExecuteSpy
    });
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.card-action-wrap')).toBeVisible();

    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(retrySpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('已线下执行'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(offlineExecuteSpy).toHaveBeenCalledTimes(1);
  });
});
