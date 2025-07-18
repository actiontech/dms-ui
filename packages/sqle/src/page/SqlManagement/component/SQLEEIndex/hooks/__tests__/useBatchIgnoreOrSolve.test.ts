import { sqleSuperRenderHook } from '../../../../../../testUtils/superRender';
import useBatchIgnoreOrSolve from '../useBatchIgnoreOrSolve';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import sqlManage from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('SqlManagement/useBatchIgnoreOrSolve', () => {
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

  it('send request with empty row key', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = sqleSuperRenderHook(() =>
      useBatchIgnoreOrSolve([], mockBatch)
    );
    expect(result.current.batchIgnoreLoading).toBe(false);
    expect(result.current.batchSolveLoading).toBe(false);
    await act(async () => {
      result.current.onBatchIgnore();
      result.current.onBatchSolve();
    });
    expect(request).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
  });

  it('send batch solve request', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = sqleSuperRenderHook(() =>
      useBatchIgnoreOrSolve(['249'], mockBatch)
    );
    expect(result.current.batchSolveLoading).toBe(false);
    await act(async () => {
      result.current.onBatchSolve();
    });
    expect(result.current.batchSolveLoading).toBe(true);
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      status: BatchUpdateSqlManageReqStatusEnum.solved,
      sql_manage_id_list: [249]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockBatch).toHaveBeenCalledWith('批量解决SQL成功');
    expect(result.current.batchSolveLoading).toBe(false);
  });

  it('send batch ignore request', async () => {
    const request = sqlManage.batchUpdateSqlManage();
    const { result } = sqleSuperRenderHook(() =>
      useBatchIgnoreOrSolve(['249'], mockBatch)
    );
    expect(result.current.batchIgnoreLoading).toBe(false);
    await act(async () => {
      result.current.onBatchIgnore();
    });
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      status: BatchUpdateSqlManageReqStatusEnum.ignored,
      sql_manage_id_list: [249]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockBatch).toHaveBeenCalledWith('批量忽略SQL成功');
    expect(result.current.batchIgnoreLoading).toBe(false);
  });
});
