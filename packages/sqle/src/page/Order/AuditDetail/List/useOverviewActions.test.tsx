import useOverviewActions from './useOverviewActions';

import { renderWithTheme } from '../../../../testUtils/customRender';
import {
  cleanup,
  renderHook,
  act,
  screen,
  fireEvent
} from '@testing-library/react';
import order from '../../../../testUtils/mockApi/order';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const projectName = 'default';
const workflowID = 'workflow ID';
const recordData = {
  instance_name: 'instance_name',
  status: GetWorkflowTasksItemV2StatusEnum.exec_failed,
  task_id: 1,
  task_score: 10
};

const MockComponent = () => {
  const { contextHolder, ...otherParams } = useOverviewActions({
    projectName,
    workflowID,
    refreshOverview: () => {},
    refreshOrder: () => {}
  });

  const clickFn = (
    name: 'sqlExecuteHandle' | 'sqlTerminateHandle' | 'scheduleTimeHandle'
  ) => {
    otherParams?.[name]('params string for mock component');
  };
  return (
    <>
      {contextHolder}
      <button onClick={() => clickFn('sqlExecuteHandle')}>
        sqlExecuteHandle
      </button>
      <button onClick={() => clickFn('sqlTerminateHandle')}>
        sqlTerminateHandle
      </button>
      <button onClick={() => clickFn('scheduleTimeHandle')}>
        scheduleTimeHandle
      </button>
    </>
  );
};

describe('sqle/Order/AuditDetail/OrderDetailAuditResultList/useOverviewActions', () => {
  const refreshOverviewFn = jest.fn();
  const refreshOrderFn = jest.fn();

  let requestSqlExecute: jest.SpyInstance;
  let requestSqlTerminateTime: jest.SpyInstance;
  let requestScheduleTime: jest.SpyInstance;

  const customRender = () => {
    return renderHook(() =>
      useOverviewActions({
        projectName,
        workflowID,
        refreshOverview: refreshOverviewFn,
        refreshOrder: refreshOrderFn
      })
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    order.mockAllApi();
    requestSqlExecute = order.executeOneTaskOnWorkflow();
    requestSqlTerminateTime = order.terminateSingleTaskByWorkflow();
    requestScheduleTime = order.updateWorkflowSchedule();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render execute openScheduleModalAndSetCurrentTask', async () => {
    const { result } = customRender();

    expect(result.current.scheduleModalVisible).toBeFalsy();
    expect(result.current.currentTask).toBeNull();

    await act(async () => {
      result.current.openScheduleModalAndSetCurrentTask(recordData);
    });
    expect(result.current.scheduleModalVisible).toBeTruthy();
    expect(result.current.currentTask).toEqual(recordData);
  });

  it('render execute sqlExecuteHandle', async () => {
    renderWithTheme(<MockComponent />);

    expect(screen.getByText('sqlExecuteHandle')).toBeInTheDocument();
    fireEvent.click(screen.getByText('sqlExecuteHandle'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSqlExecute).toHaveBeenCalled();
    expect(requestSqlExecute).toHaveBeenCalledWith({
      workflow_id: workflowID,
      task_id: 'params string for mock component',
      project_name: projectName
    });
  });

  it('render execute sqlTerminateHandle', async () => {
    renderWithTheme(<MockComponent />);

    expect(screen.getByText('sqlTerminateHandle')).toBeInTheDocument();
    fireEvent.click(screen.getByText('sqlTerminateHandle'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSqlTerminateTime).toHaveBeenCalled();
    expect(requestSqlTerminateTime).toHaveBeenCalledWith({
      workflow_id: workflowID,
      task_id: 'params string for mock component',
      project_name: projectName
    });
  });

  it('render execute scheduleTimeHandle', async () => {
    renderWithTheme(<MockComponent />);

    expect(screen.getByText('scheduleTimeHandle')).toBeInTheDocument();
    fireEvent.click(screen.getByText('scheduleTimeHandle'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestScheduleTime).toHaveBeenCalled();
    expect(requestScheduleTime).toHaveBeenCalledWith({
      workflow_id: workflowID,
      task_id: '',
      schedule_time: 'params string for mock component',
      project_name: projectName
    });
  });
});
