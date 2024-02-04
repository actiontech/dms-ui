import { useDispatch, useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useDataExportDetailReduxManage from '../index.redux';
import { mockDataExportDetailRedux } from '../../testUtils/mockUseDataExportDetailReduxManage';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('test useDataExportDetailReduxManage', () => {
  const useSelectorMock = useSelector as jest.Mock;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useSelectorMock.mockImplementation((e) =>
      e({
        dataExport: {
          detail: {
            workflowStepOpen: mockDataExportDetailRedux.workflowStepOpen,
            workflowRejectOpen: mockDataExportDetailRedux.workflowRejectOpen,
            workflowInfo: mockDataExportDetailRedux.workflowInfo,
            taskInfos: mockDataExportDetailRedux.taskInfos,
            curTaskId: mockDataExportDetailRedux.curTaskID,
            taskStatusNumber: mockDataExportDetailRedux.taskStatusNumber,
            canRejectWorkflow: mockDataExportDetailRedux.canRejectWorkflow
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { result } = renderHook(() => useDataExportDetailReduxManage());
    expect(result.current).toMatchSnapshot();
  });

  it('should execute dispatch', () => {
    const { result } = renderHook(() => useDataExportDetailReduxManage());

    result.current.updateWorkflowStepOpen(
      mockDataExportDetailRedux.workflowStepOpen
    );
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        workflowStepOpen: mockDataExportDetailRedux.workflowStepOpen
      },
      type: 'dataExportManagement/updateWorkflowStepOpen'
    });

    result.current.updateWorkflowRejectOpen(
      mockDataExportDetailRedux.workflowRejectOpen
    );
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).nthCalledWith(2, {
      payload: {
        workflowRejectOpen: mockDataExportDetailRedux.workflowRejectOpen
      },
      type: 'dataExportManagement/updateWorkflowRejectOpen'
    });

    result.current.updateWorkflowInfo(mockDataExportDetailRedux.workflowInfo);
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).nthCalledWith(3, {
      payload: {
        workflowInfo: mockDataExportDetailRedux.workflowInfo
      },
      type: 'dataExportManagement/updateWorkflowInfo'
    });

    result.current.updateTaskInfos(mockDataExportDetailRedux.taskInfos);
    expect(dispatchSpy).toBeCalledTimes(4);
    expect(dispatchSpy).nthCalledWith(4, {
      payload: {
        taskInfos: mockDataExportDetailRedux.taskInfos
      },
      type: 'dataExportManagement/updateTaskInfos'
    });

    result.current.updateCurTaskID(mockDataExportDetailRedux.curTaskID);
    expect(dispatchSpy).toBeCalledTimes(5);
    expect(dispatchSpy).nthCalledWith(5, {
      payload: {
        taskID: mockDataExportDetailRedux.curTaskID
      },
      type: 'dataExportManagement/updateCurTaskID'
    });

    result.current.updateTaskStatusNumber(
      mockDataExportDetailRedux.taskStatusNumber
    );
    expect(dispatchSpy).toBeCalledTimes(6);
    expect(dispatchSpy).nthCalledWith(6, {
      payload: {
        taskStatusNumber: mockDataExportDetailRedux.taskStatusNumber
      },
      type: 'dataExportManagement/updateTaskStatusNumber'
    });

    result.current.updateCanRejectWorkflow(
      mockDataExportDetailRedux.canRejectWorkflow
    );
    expect(dispatchSpy).toBeCalledTimes(7);
    expect(dispatchSpy).nthCalledWith(7, {
      payload: {
        canRejectWorkflow: mockDataExportDetailRedux.canRejectWorkflow
      },
      type: 'dataExportManagement/updateCanRejectWorkflow'
    });

    result.current.clearAllDetailState();
    expect(dispatchSpy).toBeCalledTimes(8);
    expect(dispatchSpy).nthCalledWith(8, {
      type: 'dataExportManagement/clearAllDetailState'
    });
  });
});
