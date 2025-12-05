import { act, renderHook } from '@testing-library/react';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import useOverviewActions from '../useOverviewActions';
import useMessage from 'antd/es/message/useMessage';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WorkflowTasksItemData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';

jest.mock('antd/es/message/useMessage', () => jest.fn());

describe('test useOverviewActions', () => {
  let executeOneTaskOnWorkflowSpy: jest.SpyInstance;
  let terminateSingleTaskByWorkflowSpy: jest.SpyInstance;
  let updateWorkflowScheduleSpy: jest.SpyInstance;

  const projectName = 'test-project';
  const workflowId = '123';
  const taskId = '456';
  const mockMessageSuccess = jest.fn();
  const mockRefreshOverview = jest.fn();
  const mockRefreshWorkflow = jest.fn();
  const mockContentHolder = 'mockContentHolder';

  beforeEach(() => {
    jest.useFakeTimers();
    executeOneTaskOnWorkflowSpy = execWorkflow.executeOneTaskOnWorkflow();
    terminateSingleTaskByWorkflowSpy =
      execWorkflow.terminateSingleTaskByWorkflow();
    updateWorkflowScheduleSpy = execWorkflow.updateWorkflowSchedule();
    (useMessage as jest.Mock).mockImplementation(() => [
      { success: mockMessageSuccess },
      mockContentHolder
    ]);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should execute a task and refresh overview', async () => {
    const { result } = renderHook(() =>
      useOverviewActions({
        projectName,
        workflowId,
        refreshOverview: mockRefreshOverview,
        refreshWorkflow: mockRefreshWorkflow
      })
    );

    await act(async () => {
      result.current.sqlExecuteHandle(taskId);
    });

    expect(executeOneTaskOnWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowId,
      task_id: taskId,
      project_name: projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockMessageSuccess).toHaveBeenCalledTimes(1);
    expect(mockMessageSuccess).toHaveBeenCalledWith('立即上线操作已提交');
    expect(mockRefreshOverview).toHaveBeenCalledTimes(1);
    expect(mockRefreshWorkflow).toHaveBeenCalledTimes(1);
  });

  it('should terminate a task and refresh overview', async () => {
    const { result } = renderHook(() =>
      useOverviewActions({
        projectName,
        workflowId,
        refreshOverview: mockRefreshOverview,
        refreshWorkflow: mockRefreshWorkflow
      })
    );

    await act(async () => {
      result.current.sqlTerminateHandle(taskId);
    });

    expect(terminateSingleTaskByWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(terminateSingleTaskByWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowId,
      task_id: taskId,
      project_name: projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockMessageSuccess).toHaveBeenCalledTimes(1);
    expect(mockMessageSuccess).toHaveBeenCalledWith('中止上线成功');
    expect(mockRefreshOverview).toHaveBeenCalledTimes(1);
    expect(mockRefreshWorkflow).toHaveBeenCalledTimes(1);
  });

  it('should schedule a task and refresh overview', async () => {
    const { result } = renderHook(() =>
      useOverviewActions({
        projectName,
        workflowId,
        refreshOverview: mockRefreshOverview,
        refreshWorkflow: mockRefreshWorkflow
      })
    );

    await act(async () => {
      result.current.scheduleTimeHandle(
        '2021-01-01T00:00:00Z',
        true,
        UpdateWorkflowScheduleReqV2NotifyTypeEnum.feishu,
        taskId
      );
    });

    expect(updateWorkflowScheduleSpy).toHaveBeenCalledTimes(1);
    expect(updateWorkflowScheduleSpy).toHaveBeenNthCalledWith(1, {
      workflow_id: workflowId,
      task_id: taskId,
      schedule_time: '2021-01-01T00:00:00Z',
      project_name: projectName,
      is_notify: true,
      notify_type: UpdateWorkflowScheduleReqV2NotifyTypeEnum.feishu
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockMessageSuccess).toHaveBeenCalledTimes(1);
    expect(mockMessageSuccess).toHaveBeenCalledWith('定时上线设置成功');

    expect(mockRefreshOverview).toHaveBeenCalledTimes(1);
    expect(mockRefreshWorkflow).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.scheduleTimeHandle(
        undefined,
        undefined,
        undefined,
        taskId
      );
    });

    expect(updateWorkflowScheduleSpy).toHaveBeenCalledTimes(2);
    expect(updateWorkflowScheduleSpy).toHaveBeenNthCalledWith(2, {
      workflow_id: workflowId,
      task_id: taskId,
      project_name: projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockMessageSuccess).toHaveBeenCalledTimes(2);
    expect(mockMessageSuccess).toHaveBeenCalledWith('取消定时上线成功');

    expect(mockRefreshOverview).toHaveBeenCalledTimes(2);
    expect(mockRefreshWorkflow).toHaveBeenCalledTimes(2);
  });

  it('should set current task and open modal', async () => {
    const { result } = renderHook(() =>
      useOverviewActions({
        projectName,
        workflowId,
        refreshOverview: mockRefreshOverview,
        refreshWorkflow: mockRefreshWorkflow
      })
    );

    expect(result.current.currentTask).toEqual(null);
    expect(result.current.scheduleModalVisible).toBeFalsy();
    expect(result.current.contextHolder).toBe(mockContentHolder);

    await act(async () => {
      result.current.openScheduleModalAndSetCurrentTask(
        WorkflowTasksItemData[0]
      );
    });

    expect(result.current.currentTask).toEqual(WorkflowTasksItemData[0]);
    expect(result.current.scheduleModalVisible).toBeTruthy();
  });
});
