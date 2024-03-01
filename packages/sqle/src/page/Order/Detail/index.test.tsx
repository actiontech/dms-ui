import OrderDetail from '.';
import { useParams } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import order from '../../../testUtils/mockApi/order';
import {
  workflowsDetailWaitForAuditData,
  workflowsDetailWaitForExecutionData,
  workflowsDetailExecutingData
} from '../../../testUtils/mockApi/order/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import task from '../../../testUtils/mockApi/task';
import { workflowTaskDetailMockData } from '../../../testUtils/mockApi/task/data';
import {
  workflowsDetailData,
  WorkflowTasksItemData
} from '../../../testUtils/mockApi/order/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  WorkflowResV2ModeEnum,
  GetWorkflowTasksItemV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/Order/Detail', () => {
  let requestTaskInfo: jest.SpyInstance;
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
    order.mockAllApi();
    task.mockAllApi();
    requestTaskInfo = order.getWorkflow();
    approveWorkflowSpy = order.approveWorkflow();
    rejectWorkflowSpy = order.rejectWorkflow();
    cancelWorkflowSpy = order.cancelWorkflow();
    getSummaryOfInstanceTasksSpy = order.getSummaryOfInstanceTasks();
    executeTasksOnWorkflow = order.executeTasksOnWorkflow();
    batchCompleteWorkflowsSpy = order.batchCompleteWorkflows();
    terminateMultipleTaskByWorkflowSpy =
      order.terminateMultipleTaskByWorkflow();
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
    useParamsMock.mockReturnValue({ orderId: 'orderId' });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<OrderDetail />);
  };

  it('render snap detail', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(requestTaskInfo).toHaveBeenCalled();
    expect(requestTaskInfo).toHaveBeenCalledWith({
      project_name: 'default',
      workflow_id: 'orderId'
    });
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
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
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
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
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
    expect(requestTaskInfo).toBeCalled();
    expect(requestTaskInfo).toBeCalledWith({
      project_name: 'default',
      workflow_id: 'orderId'
    });
    expect(getSummaryOfInstanceTasksSpy).toBeCalledTimes(1);
    expect(getAuditTaskSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('工单信息'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.reject-order-reason-content')).toBeVisible();
    fireEvent.click(getBySelector('.reject-order-reason-content').nextSibling!);
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
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...workflowsDetailData,
          mode: WorkflowResV2ModeEnum.same_sqls
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();
    expect(requestTaskInfo).toBeCalledWith({
      project_name: 'default',
      workflow_id: 'orderId'
    });
    expect(getSummaryOfInstanceTasksSpy).toBeCalledTimes(1);
    expect(getAuditTaskSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('工单信息'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.reject-order-reason-content')).toBeVisible();
    fireEvent.click(getBySelector('.reject-order-reason-content').nextSibling!);
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

  it('render current order status is wait for audit', async () => {
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailWaitForAuditData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('审核通过'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(approveWorkflowSpy).toBeCalledTimes(1);
    expect(approveWorkflowSpy).toBeCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      workflow_step_id: '23',

      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();

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
    expect(rejectWorkflowSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(4000));

    expect(rejectWorkflowSpy).toBeCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      workflow_step_id: '23',
      reason: 'test',
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();

    cleanup();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('关闭工单'));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(cancelWorkflowSpy).toBeCalledTimes(1);
    expect(cancelWorkflowSpy).toBeCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();
  });

  it('render current order status is wait for execution', async () => {
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
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

    expect(executeTasksOnWorkflow).toBeCalledTimes(1);
    expect(executeTasksOnWorkflow).toBeCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();

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

    expect(batchCompleteWorkflowsSpy).toBeCalledTimes(1);
    expect(batchCompleteWorkflowsSpy).toBeCalledWith({
      workflow_id_list: [workflowsDetailData.workflow_id],
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();
  });

  it('render current order status is executing', async () => {
    requestTaskInfo.mockClear();
    requestTaskInfo.mockImplementation(() =>
      createSpySuccessResponse({ data: workflowsDetailExecutingData })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('中止上线')).toBeVisible();
    expect(screen.getByText('刷新工单')).toBeVisible();
    fireEvent.click(screen.getByText('刷新工单'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();

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
    expect(terminateMultipleTaskByWorkflowSpy).toBeCalledTimes(1);
    expect(terminateMultipleTaskByWorkflowSpy).toBeCalledWith({
      workflow_id: workflowsDetailData.workflow_id,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskInfo).toBeCalled();
  });
});
