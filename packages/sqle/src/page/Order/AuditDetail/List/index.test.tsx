import OrderDetailAuditResultList from '.';
import { OrderDetailAuditResultListProps } from './index.type';

import { renderWithThemeAndRedux } from '../../../../testUtils/customRender';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import order from '../../../../testUtils/mockApi/order';
import {
  WorkflowRecordResV2StatusEnum,
  GetWorkflowTasksItemV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

const workflowID = 'workflow ID';
const projectName = 'project Name default';

describe('sqle/Order/AuditDetail/OrderDetailAuditResultList', () => {
  const getOverviewListSuccessFn = jest.fn();
  const setAuditResultActiveKeyFn = jest.fn();
  const refreshOrderFn = jest.fn();

  let requestGetSummaryOfInstanceTasks: jest.SpyInstance;
  let terminateSingleTaskByWorkflow: jest.SpyInstance;

  const customRender = (
    params: {
      orderStatus?: WorkflowRecordResV2StatusEnum;
      isArchive: boolean;
      refreshOverviewFlag: boolean;
    } = {
      isArchive: false,
      refreshOverviewFlag: false
    }
  ) => {
    const defaultParams: OrderDetailAuditResultListProps = {
      workflowID,
      projectName,
      getOverviewListSuccessHandle: getOverviewListSuccessFn,
      setAuditResultActiveKey: setAuditResultActiveKeyFn,
      refreshOrder: refreshOrderFn,
      ...params
    };
    return renderWithThemeAndRedux(
      <OrderDetailAuditResultList {...defaultParams} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    order.mockAllApi();
    requestGetSummaryOfInstanceTasks = order.getSummaryOfInstanceTasks();
    terminateSingleTaskByWorkflow = order.terminateSingleTaskByWorkflow();
    // date picker : custom attr [hideSuperIcon]
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap list when isArchive is false', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(requestGetSummaryOfInstanceTasks).toBeCalledWith({
      workflow_id: workflowID,
      project_name: projectName
    });
    const tableRows = getAllBySelector('.ant-table-row');
    fireEvent.click(tableRows[1]);
    expect(setAuditResultActiveKeyFn).toBeCalledTimes(1);
  });

  it('render snap list when isArchive is true', async () => {
    const { baseElement } = customRender({
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap list when order status is finished', async () => {
    const { baseElement } = customRender({
      isArchive: true,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.finished
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap list when task is executing', async () => {
    requestGetSummaryOfInstanceTasks.mockClear();
    requestGetSummaryOfInstanceTasks.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            task_id: 42,
            instance_name: 'mysql2',
            status: GetWorkflowTasksItemV2StatusEnum.executing,
            exec_start_time: '2024-01-17T05:23:32Z',
            exec_end_time: '2024-01-17T05:23:32Z',
            task_pass_rate: 1,
            task_score: 100,
            instance_maintenance_times: [],
            execution_user_name: 'admin',
            current_step_assignee_user_name_list: ['admin']
          }
        ]
      })
    );
    const { baseElement } = customRender({
      isArchive: false,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.finished
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('中止上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('中止上线'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText(
        '此操作将中断当前上线操作, 并回滚当前正在执行的SQL, 是否确认中止上线?'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(terminateSingleTaskByWorkflow).toBeCalledTimes(1);
  });

  it('render execute btn', async () => {
    requestGetSummaryOfInstanceTasks.mockClear();
    requestGetSummaryOfInstanceTasks.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            task_id: 42,
            instance_name: 'mysql2',
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            exec_start_time: '2024-01-17T05:23:32Z',
            exec_end_time: '2024-01-17T05:23:32Z',
            task_pass_rate: 1,
            task_score: 100,
            instance_maintenance_times: [],
            execution_user_name: 'admin',
            current_step_assignee_user_name_list: ['admin']
          }
        ]
      })
    );
    customRender({
      isArchive: false,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(screen.getByText('立即上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('立即上线'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText(
        '当前操作将立即执行该数据源上的SQL语句, 是否确认立即上线'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
  });

  it('render schedule  btn', async () => {
    requestGetSummaryOfInstanceTasks.mockClear();
    requestGetSummaryOfInstanceTasks.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            task_id: 42,
            instance_name: 'mysql2',
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            exec_start_time: '2024-01-17T05:23:32Z',
            exec_end_time: '2024-01-17T05:23:32Z',
            task_pass_rate: 1,
            task_score: 100,
            instance_maintenance_times: [],
            execution_user_name: 'admin',
            current_step_assignee_user_name_list: ['admin']
          }
        ]
      })
    );
    customRender({
      isArchive: false,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(screen.getByText('定时上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('定时上线'));
    await act(async () => jest.advanceTimersByTime(100));
  });

  it('render cancel exec scheduled', async () => {
    requestGetSummaryOfInstanceTasks.mockClear();
    requestGetSummaryOfInstanceTasks.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            task_id: 42,
            instance_name: 'mysql2',
            status: GetWorkflowTasksItemV2StatusEnum.exec_scheduled,
            exec_start_time: '2024-01-17T05:23:32Z',
            exec_end_time: '2024-01-17T05:23:32Z',
            task_pass_rate: 1,
            task_score: 100,
            instance_maintenance_times: [],
            execution_user_name: 'admin',
            current_step_assignee_user_name_list: ['admin']
          }
        ]
      })
    );
    customRender({
      isArchive: false,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(screen.getByText('取消定时上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取消定时上线'));
    await act(async () => jest.advanceTimersByTime(100));
  });

  it('render execute btn when has instance_maintenance_times', async () => {
    requestGetSummaryOfInstanceTasks.mockClear();
    requestGetSummaryOfInstanceTasks.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            task_id: 42,
            instance_name: 'mysql2',
            status: GetWorkflowTasksItemV2StatusEnum.wait_for_execution,
            exec_start_time: '2024-01-17T05:23:32Z',
            exec_end_time: '2024-01-17T05:23:32Z',
            task_pass_rate: 1,
            task_score: 100,
            instance_maintenance_times: [
              {
                maintenance_start_time: {
                  hour: 5,
                  minute: 20
                },
                maintenance_stop_time: {
                  hour: 5,
                  minute: 40
                }
              }
            ],
            execution_user_name: 'admin',
            current_step_assignee_user_name_list: ['admin']
          }
        ]
      })
    );
    customRender({
      isArchive: false,
      refreshOverviewFlag: true,
      orderStatus: WorkflowRecordResV2StatusEnum.wait_for_execution
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toBeCalled();
    expect(screen.getByText('立即上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('立即上线'));
  });
});
