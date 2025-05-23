import { act } from '@testing-library/react';
import useBatchCheckConnectable from '../useBatchCheckConnectable';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import {
  mockBatchImportDBCheckData,
  mockCheckDBServicesPrivilegesIncludeErrorData
} from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { baseSuperRenderHook } from '../../../../../testUtils/superRender';

describe('useBatchCheckConnectable', () => {
  let checkDBServicesPrivilegesSpy: jest.SpyInstance;

  beforeEach(() => {
    checkDBServicesPrivilegesSpy = project.checkDBServicesPrivileges();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = baseSuperRenderHook(() => useBatchCheckConnectable());

    expect(result.current.connectableInfo).toBeUndefined();
    expect(result.current.batchCheckConnectableLoading).toBe(false);
    expect(result.current.connectErrorModalVisible).toBe(false);
    expect(typeof result.current.batchCheckConnectable).toBe('function');
    expect(typeof result.current.showConnectErrorModal).toBe('function');
    expect(typeof result.current.hideConnectErrorModal).toBe('function');
  });

  it('should handle successful API response with all connectable services', async () => {
    const { result } = baseSuperRenderHook(() => useBatchCheckConnectable());

    await act(async () => {
      result.current.batchCheckConnectable(mockBatchImportDBCheckData);
      await jest.advanceTimersByTime(3000);
    });

    expect(checkDBServicesPrivilegesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.connectableInfo?.isConnectable).toBe(true);
    expect(result.current.connectableInfo?.connectErrorList).toEqual([]);
  });

  it('should handle API response with non-connectable services', async () => {
    checkDBServicesPrivilegesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCheckDBServicesPrivilegesIncludeErrorData
      })
    );

    const { result } = baseSuperRenderHook(() => useBatchCheckConnectable());
    expect(result.current.batchCheckConnectableLoading).toBe(false);
    act(() => {
      result.current.batchCheckConnectable(mockBatchImportDBCheckData);
    });
    expect(result.current.batchCheckConnectableLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(checkDBServicesPrivilegesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.connectableInfo?.isConnectable).toBe(false);
    expect(result.current.connectableInfo?.connectErrorList).toHaveLength(1);
    expect(result.current.connectableInfo?.connectErrorList?.[0]).toEqual({
      name: 'mysql_1',
      connect_error_message: expect.stringContaining('slqe: 权限不足')
    });
  });

  it('should handle modal visibility functions', () => {
    const { result } = baseSuperRenderHook(() => useBatchCheckConnectable());

    expect(result.current.connectErrorModalVisible).toBe(false);

    act(() => {
      result.current.showConnectErrorModal();
    });

    expect(result.current.connectErrorModalVisible).toBe(true);

    act(() => {
      result.current.hideConnectErrorModal();
    });

    expect(result.current.connectErrorModalVisible).toBe(false);
  });
});
