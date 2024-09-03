import WorkflowDetail from '..';
import { useParams } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import {
  workflowsDetailWaitForAuditData,
  workflowsDetailWaitForExecutionData,
  workflowsDetailExecutingData,
  workflowsDetailData,
  WorkflowTasksItemData
} from '../../../../testUtils/mockApi/execWorkflow/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import task from '../../../../testUtils/mockApi/task';
import { workflowTaskDetailMockData } from '../../../../testUtils/mockApi/task/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  WorkflowResV2ModeEnum,
  GetWorkflowTasksItemV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/ExecWorkflow/Detail', () => {
  let requestWorkflowInfo: jest.SpyInstance;
  let getAuditTaskSpy: jest.SpyInstance;
  let getSummaryOfInstanceTasksSpy: jest.SpyInstance;
  let approveWorkflowSpy: jest.SpyInstance;
  let rejectWorkflowSpy: jest.SpyInstance;
  let cancelWorkflowSpy: jest.SpyInstance;
  let executeTasksOnWorkflow: jest.SpyInstance;
  let batchCompleteWorkflowsSpy: jest.SpyInstance;
  let terminateMultipleTaskByWorkflowSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    execWorkflow.mockAllApi();
    task.mockAllApi();
    requestWorkflowInfo = execWorkflow.getWorkflow();
    approveWorkflowSpy = execWorkflow.approveWorkflow();
    rejectWorkflowSpy = execWorkflow.rejectWorkflow();
    cancelWorkflowSpy = execWorkflow.cancelWorkflow();
    getSummaryOfInstanceTasksSpy = execWorkflow.getSummaryOfInstanceTasks();
    executeTasksOnWorkflow = execWorkflow.executeTasksOnWorkflow();
    batchCompleteWorkflowsSpy = execWorkflow.batchCompleteWorkflows();
    terminateMultipleTaskByWorkflowSpy =
      execWorkflow.terminateMultipleTaskByWorkflow();
    getSummaryOfInstanceTasksSpy.mockClear();
    getSummaryOfInstanceTasksSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...WorkflowTasksItemData[0],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_audit
          }
        ]
      })
    );
    getAuditTaskSpy = task.getAuditTask();
    useParamsMock.mockReturnValue({ workflowId: 'workflowId' });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<WorkflowDetail />);
  };

  it('render snap detail', async () => {
    mockUseCurrentUser({
      isProjectManager: jest.fn(() => true)
    });
    getAuditTaskSpy
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: { ...workflowTaskDetailMockData, task_id: 1 }
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: { ...workflowTaskDetailMockData, task_id: 2 }
        })
      );
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(requestWorkflowInfo).toHaveBeenCalledTimes(1);
    expect(requestWorkflowInfo).toHaveBeenCalledWith({
      project_name: 'default',
      workflow_id: 'workflowId'
    });
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledWith({
      project_name: 'default',
      workflow_id: 'workflowId'
    });
    expect(getAuditTaskSpy).not.toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getAuditTaskSpy).toHaveBeenCalledTimes(2);
    expect(getAuditTaskSpy).toHaveBeenNthCalledWith(1, {
      task_id: '40'
    });
    expect(getAuditTaskSpy).toHaveBeenNthCalledWith(2, {
      task_id: '41'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap detail when have multiple states', async () => {
    getSummaryOfInstanceTasksSpy.mockClear();
    getSummaryOfInstanceTasksSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...WorkflowTasksItemData[0],
            task_id: 1,
            status: GetWorkflowTasksItemV2StatusEnum.exec_succeeded
          },
          {
            ...WorkflowTasksItemData[0],
            task_id: 2,
            status: GetWorkflowTasksItemV2StatusEnum.executing
          },
          {
            ...WorkflowTasksItemData[0],
            task_id: 3,
            status: GetWorkflowTasksItemV2StatusEnum.exec_failed
          }
        ]
      })
    );
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...workflowsDetailData,
          record: {
            ...workflowsDetailData.record,
            tasks: [
              {
                task_id: 1
              },
              {
                task_id: 2
              },
              {
                task_id: 3
              }
            ]
          }
        }
      })
    );
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailData })
    );
    getAuditTaskSpy.mockClear();
    getAuditTaskSpy
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: { ...workflowTaskDetailMockData, task_id: 1 }
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: { ...workflowTaskDetailMockData, task_id: 2 }
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: { ...workflowTaskDetailMockData, task_id: 3 }
        })
      );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();
    expect(requestWorkflowInfo).toHaveBeenCalledWith({
      project_name: 'default',
      workflow_id: 'workflowId'
    });
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('工单详情'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.reject-workflow-reason-content')).toBeVisible();
    fireEvent.click(screen.getByText('修改审核语句'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('输入SQL语句')).toBeVisible();
    expect(screen.getByText('上传SQL文件')).toBeVisible();
    expect(screen.getByText('上传ZIP文件')).toBeVisible();

    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('返回工单详情'));
  });

  it('render snap detail when mode is same_sqls', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...workflowsDetailData,
          mode: WorkflowResV2ModeEnum.same_sqls
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();
    expect(requestWorkflowInfo).toHaveBeenCalledWith({
      project_name: 'default',
      workflow_id: 'workflowId'
    });
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('工单详情'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.reject-workflow-reason-content')).toBeVisible();
    fireEvent.click(screen.getByText('修改审核语句'));

    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('输入SQL语句')).toBeVisible();
    expect(screen.getByText('上传SQL文件')).toBeVisible();
    expect(screen.getByText('上传ZIP文件')).toBeVisible();

    fireEvent.input(getBySelector('.custom-monaco-editor'), {
      target: { value: 'SELECT 1;' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('返回工单详情'));
  });

  it('render current workflow status is wait for audit', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailWaitForAuditData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('审核通过'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(approveWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(approveWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      workflow_step_id: '23',

      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();

    cleanup();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('全部驳回'));
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.input(getBySelector('#reason'), {
        target: { value: 'test' }
      });
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.click(screen.getByText('驳 回'));
      await jest.advanceTimersByTime(100);
    });
    expect(rejectWorkflowSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(4000));

    expect(rejectWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      workflow_step_id: '23',
      reason: 'test',
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();

    cleanup();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('关闭工单'));
    expect(screen.getByText('您确认关闭当前工单？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(cancelWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(cancelWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();
  });

  it('render current workflow status is wait for execution', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailWaitForExecutionData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('批量立即上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '当前操作将立即执行工单下的所有SQL语句，且已经设置了定时上线的数据源仍然在定时时间上线，不会立即上线，是否确认立即批量上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(3000);
    });

    expect(executeTasksOnWorkflow).toHaveBeenCalledTimes(1);
    expect(executeTasksOnWorkflow).toHaveBeenCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();

    cleanup();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('标记为人工上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '当前操作仅修改工单状态，而不对数据源产生操作，是否确认标记为人工上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(3000);
    });

    expect(batchCompleteWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(batchCompleteWorkflowsSpy).toHaveBeenCalledWith({
      workflow_id_list: [workflowsDetailData.workflow_id],
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();
  });

  it('render current workflow status is executing', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailExecutingData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('中止上线')).toBeVisible();
    expect(screen.getByText('刷新工单')).toBeVisible();
    fireEvent.click(screen.getByText('刷新工单'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByText('中止上线'));
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText(
        '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?'
      )
    ).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('确 认'));
      await jest.advanceTimersByTime(3000);
    });
    expect(terminateMultipleTaskByWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(terminateMultipleTaskByWorkflowSpy).toHaveBeenCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalled();
  });

  it('render polling request when workflow status is executing or some task status is executing', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailExecutingData })
    );
    getSummaryOfInstanceTasksSpy.mockClear();
    getSummaryOfInstanceTasksSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...WorkflowTasksItemData[0],
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_audit
          },
          {
            ...WorkflowTasksItemData[0],
            task_id: 3,
            status: GetWorkflowTasksItemV2StatusEnum.executing
          }
        ]
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalledTimes(1);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalledTimes(2);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(2);
  });

  it('render polling request when workflow status is not executing or all of task status is not executing', async () => {
    requestWorkflowInfo.mockClear();
    requestWorkflowInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailWaitForAuditData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalledTimes(1);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestWorkflowInfo).toHaveBeenCalledTimes(1);
    expect(getSummaryOfInstanceTasksSpy).toHaveBeenCalledTimes(1);
  });
});
