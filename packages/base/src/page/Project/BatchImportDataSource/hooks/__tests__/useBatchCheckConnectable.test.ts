import { act } from '@testing-library/react';
import useBatchCheckConnectable from '../useBatchCheckConnectable';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import {
  mockBatchImportDBCheckData,
  mockCheckDBServicesPrivilegesIncludeErrorData
} from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { baseSuperRenderHook } from '../../../../../testUtils/superRender';

const projectUid = '700300';
const dbServicesWithProject = mockBatchImportDBCheckData.map((item) => ({
  ...item,
  project_uid: projectUid
}));

const connectableSuccessReply = [
  { component: 'sqle', is_connectable: true },
  { component: 'provision', is_connectable: true }
];

describe('useBatchCheckConnectable', () => {
  let checkDBServicesPrivilegesSpy: jest.SpyInstance;
  let checkDBServiceIsConnectableSpy: jest.SpyInstance;

  beforeEach(() => {
    checkDBServicesPrivilegesSpy = project.checkDBServicesPrivileges();
    checkDBServiceIsConnectableSpy = dbServices.checkDbServiceIsConnectable();
    checkDBServiceIsConnectableSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: connectableSuccessReply
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = baseSuperRenderHook(() =>
      useBatchCheckConnectable(projectUid)
    );

    expect(result.current.connectableInfo).toBeUndefined();
    expect(result.current.batchCheckConnectableLoading).toBe(false);
    expect(result.current.connectErrorModalVisible).toBe(false);
    expect(typeof result.current.batchCheckConnectable).toBe('function');
    expect(typeof result.current.showConnectErrorModal).toBe('function');
    expect(typeof result.current.hideConnectErrorModal).toBe('function');
  });

  it('should call connection and privilege APIs separately on success', async () => {
    const { result } = baseSuperRenderHook(() =>
      useBatchCheckConnectable(projectUid)
    );

    await act(async () => {
      const pending = result.current.batchCheckConnectable(
        dbServicesWithProject
      );
      // createSpySuccessResponse uses setTimeout(3000); connect then privilege are sequential
      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(3000);
      await pending;
    });

    expect(checkDBServiceIsConnectableSpy).toHaveBeenCalled();
    expect(checkDBServicesPrivilegesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.connectableInfo?.isConnectable).toBe(true);
    expect(result.current.connectableInfo?.connectErrorList).toEqual([]);
    expect(
      result.current.connectableInfo?.privilegeResultList?.length
    ).toBeGreaterThan(0);
  });

  it('should treat only connection API failures as connect errors', async () => {
    checkDBServiceIsConnectableSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            component: 'sqle',
            is_connectable: false,
            connect_error_message: 'connection refused'
          }
        ]
      })
    );
    checkDBServicesPrivilegesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCheckDBServicesPrivilegesIncludeErrorData
      })
    );

    const { result } = baseSuperRenderHook(() =>
      useBatchCheckConnectable(projectUid)
    );
    expect(result.current.batchCheckConnectableLoading).toBe(false);
    let pending: Promise<unknown> | undefined;
    act(() => {
      pending = result.current.batchCheckConnectable(dbServicesWithProject);
    });
    expect(result.current.batchCheckConnectableLoading).toBe(true);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(3000);
      await pending;
    });

    expect(checkDBServiceIsConnectableSpy).toHaveBeenCalled();
    expect(checkDBServicesPrivilegesSpy).toHaveBeenCalledTimes(1);
    expect(result.current.connectableInfo?.isConnectable).toBe(false);
    expect(result.current.connectableInfo?.connectErrorList).toHaveLength(2);
    expect(result.current.connectableInfo?.connectErrorList?.[0]).toEqual({
      name: 'mysql_1',
      is_connectable: false,
      connect_error_message: expect.stringContaining('connection refused')
    });
  });

  it('should not mark privilege-only issues as connect failures', async () => {
    checkDBServicesPrivilegesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCheckDBServicesPrivilegesIncludeErrorData
      })
    );

    const { result } = baseSuperRenderHook(() =>
      useBatchCheckConnectable(projectUid)
    );

    await act(async () => {
      const pending = result.current.batchCheckConnectable(
        dbServicesWithProject
      );
      await jest.advanceTimersByTimeAsync(3000);
      await jest.advanceTimersByTimeAsync(3000);
      await pending;
    });

    expect(result.current.connectableInfo?.isConnectable).toBe(true);
    expect(result.current.connectableInfo?.connectErrorList).toEqual([]);
    expect(result.current.connectableInfo?.privilegeResultList?.[0]).toEqual(
      expect.objectContaining({
        name: 'mysql_1',
        CheckDBServicesPrivileges: expect.any(Array)
      })
    );
  });

  it('should handle modal visibility functions', () => {
    const { result } = baseSuperRenderHook(() =>
      useBatchCheckConnectable(projectUid)
    );

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
