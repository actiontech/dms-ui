import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../testUtils/mockUseDataExportDetailReduxManage';
import { useParams } from 'react-router-dom';
import { act, renderHook } from '@testing-library/react';
import useInitDataWithRequest from '../useInitDataWithRequest';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import dataExport from '../../../../../testUtils/mockApi/dataExport';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { GetDataExportWorkflowResponseData } from '../../../../../testUtils/mockApi/dataExport/data';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('test base/DataExport/Detail/hooks/useInitDataWithRequest', () => {
  const workflowID = '1001';
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getWorkflowSpy: jest.SpyInstance;
  let batchGetTaskSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseDataExportDetailReduxManage();
    useParamsMock.mockReturnValue({ workflowID });
    getWorkflowSpy = dataExport.GetDataExportWorkflow();
    batchGetTaskSpy = dataExport.BatchGetDataExportTask();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should init data with request', async () => {
    batchGetTaskSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockDataExportDetailRedux.taskInfos })
    );

    const { result } = renderHook(() => useInitDataWithRequest());

    expect(result.current.getWorkflowLoading).toBeTruthy();
    expect(result.current.getTaskInfosLoading).toBeFalsy();
    expect(getWorkflowSpy).toBeCalledTimes(1);
    expect(getWorkflowSpy).toBeCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_workflow_uid: workflowID
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.getWorkflowLoading).toBeFalsy();
    expect(result.current.getTaskInfosLoading).toBeTruthy();
    expect(mockDataExportDetailRedux.updateWorkflowInfo).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateWorkflowInfo).toBeCalledWith(
      GetDataExportWorkflowResponseData
    );

    expect(batchGetTaskSpy).toBeCalledTimes(1);
    expect(batchGetTaskSpy).toBeCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_task_uids: '1752172791873933312'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.getTaskInfosLoading).toBeFalsy();

    expect(mockDataExportDetailRedux.updateTaskInfos).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateTaskInfos).toBeCalledWith(
      mockDataExportDetailRedux.taskInfos
    );

    expect(mockDataExportDetailRedux.updateTaskStatusNumber).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateTaskStatusNumber).toBeCalledWith({
      failed: 1,
      success: 1,
      exporting: 1
    });
  });

  it('should refresh workflow when executed emit event', async () => {
    renderHook(() => useInitDataWithRequest());
    expect(getWorkflowSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      eventEmitter.emit(EmitterKey.DMS_Refresh_Export_Data_Workflow);
    });

    expect(getWorkflowSpy).toBeCalledTimes(2);
    expect(getWorkflowSpy).nthCalledWith(2, {
      project_uid: mockProjectInfo.projectID,
      data_export_workflow_uid: workflowID
    });
  });
});
