import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import useBatchAction from './useBatchAction';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import sqlManage from '../../../../../testUtils/mockApi/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('SqlManagement/useBatchAction', () => {
  const mockBatch = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    sqlManage.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('send request with no actionPermission', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = renderHooksWithTheme(() =>
      useBatchAction(false, ['249'], mockBatch)
    );
    expect(result.current.batchActionsLoading).toBe(false);
    await act(async () => {
      result.current.onBatchIgnore();
      result.current.onBatchSolve();
    });
    expect(request).not.toBeCalled();
    expect(request).not.toBeCalled();
  });

  it('send request with empty row key', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = renderHooksWithTheme(() =>
      useBatchAction(true, [], mockBatch)
    );
    expect(result.current.batchActionsLoading).toBe(false);
    await act(async () => {
      result.current.onBatchIgnore();
      result.current.onBatchSolve();
    });
    expect(request).not.toBeCalled();
    expect(request).not.toBeCalled();
  });

  it('send batch solve request', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = renderHooksWithTheme(() =>
      useBatchAction(true, ['249'], mockBatch)
    );
    expect(result.current.batchActionsLoading).toBe(false);
    await act(async () => {
      result.current.onBatchSolve();
    });
    expect(result.current.batchActionsLoading).toBe(true);
    expect(request).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: [249]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockBatch).toBeCalledWith('批量解决SQL成功');
    expect(result.current.batchActionsLoading).toBe(false);
  });

  it('send batch ignore request', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = renderHooksWithTheme(() =>
      useBatchAction(true, ['249'], mockBatch)
    );
    expect(result.current.batchActionsLoading).toBe(false);
    await act(async () => {
      result.current.onBatchIgnore();
    });
    expect(request).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: [249]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockBatch).toBeCalledWith('批量忽略SQL成功');
    expect(result.current.batchActionsLoading).toBe(false);
  });
});
