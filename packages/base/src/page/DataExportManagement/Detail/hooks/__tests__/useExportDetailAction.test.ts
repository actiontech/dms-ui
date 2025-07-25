import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { act, renderHook } from '@testing-library/react';
import useExportDetailAction from '../useExportDetailAction';
import eventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('test base/DataExport/Detail/hooks/useExportDetailAction', () => {
  const messageApiSpy = {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn()
  };
  let emitSpy: jest.SpyInstance;

  beforeEach(() => {
    emitSpy = jest.spyOn(eventEmitter, 'emit');
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('execute refreshWorkflow action', () => {
    const { result } = renderHook(() => useExportDetailAction(messageApiSpy));

    result.current.refreshWorkflow();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Export_Data_Workflow
    );
  });

  it('execute closeWorkflow action', async () => {
    const closeWorkflowSpy = dataExport.CancelDataExportWorkflow();
    const { result } = renderHook(() => useExportDetailAction(messageApiSpy));

    act(() => {
      result.current.closeWorkflow('110');
    });

    expect(closeWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(closeWorkflowSpy).toHaveBeenCalledWith({
      payload: {
        data_export_workflow_uids: ['110']
      },
      project_uid: mockProjectInfo.projectID
    });

    expect(result.current.closeWorkflowLoading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.closeWorkflowLoading).toBeFalsy();
    expect(messageApiSpy.success).toHaveBeenCalledTimes(1);
    expect(messageApiSpy.success).toHaveBeenCalledWith('工单关闭成功！');
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Export_Data_Workflow
    );
  });

  it('execute approveWorkflow action', async () => {
    const approveWorkflowSpy = dataExport.ApproveDataExportWorkflow();
    const { result } = renderHook(() => useExportDetailAction(messageApiSpy));

    act(() => {
      result.current.approveWorkflow('110');
    });

    expect(approveWorkflowSpy).toHaveBeenCalledTimes(1);
    expect(approveWorkflowSpy).toHaveBeenCalledWith({
      data_export_workflow_uid: '110',
      project_uid: mockProjectInfo.projectID
    });

    expect(result.current.approveWorkflowLoading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.approveWorkflowLoading).toBeFalsy();
    expect(messageApiSpy.success).toHaveBeenCalledTimes(1);
    expect(messageApiSpy.success).toHaveBeenCalledWith('工单审核通过！');
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Export_Data_Workflow
    );
  });

  it('execute executeExport action', async () => {
    const exportDataSpy = dataExport.ExportDataExportWorkflow();
    const { result } = renderHook(() => useExportDetailAction(messageApiSpy));

    act(() => {
      result.current.executeExport('110');
    });

    expect(exportDataSpy).toHaveBeenCalledTimes(1);
    expect(exportDataSpy).toHaveBeenCalledWith({
      data_export_workflow_uid: '110',
      project_uid: mockProjectInfo.projectID
    });

    expect(result.current.executeExportLoading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.executeExportLoading).toBeFalsy();
    expect(messageApiSpy.success).toHaveBeenCalledTimes(1);
    expect(messageApiSpy.success).toHaveBeenCalledWith('工单执行导出成功！');
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Export_Data_Workflow
    );
  });
});
