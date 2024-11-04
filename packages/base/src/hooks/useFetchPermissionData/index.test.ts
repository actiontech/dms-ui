import { act, renderHook } from '@testing-library/react';
import useFetchPermissionData from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import system from 'sqle/src/testUtils/mockApi/system';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';

describe('useFetchPermissionData', () => {
  let requestGetUserOpPermissionSpy: jest.SpyInstance;
  let requestGetModalStatus: jest.SpyInstance;

  beforeEach(() => {
    requestGetUserOpPermissionSpy = userCenter.getUserOpPermission();
    requestGetModalStatus = system.getSystemModuleStatus();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useFetchPermissionData());

    expect(result.current.isModuleStatusLoading).toBeFalsy();
    expect(result.current.isFeatureSupportFetched).toBeFalsy();
    expect(result.current.isUserPermissionsLoading).toBeFalsy();
    expect(result.current.isUserPermissionsFetched).toBeFalsy();
  });

  it('should fetch module support status correctly', async () => {
    const { result } = renderHook(() => useFetchPermissionData());

    await act(() => {
      result.current.fetchModuleSupportStatus();
    });

    expect(requestGetModalStatus).toHaveBeenCalledTimes(1);
    expect(requestGetModalStatus).toHaveBeenCalledWith({
      module_name: getSystemModuleStatusModuleNameEnum.sql_optimization
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.isFeatureSupportFetched).toBeTruthy();
  });

  it('should fetch user permissions correctly', async () => {
    const { result } = renderHook(() => useFetchPermissionData());

    await act(() => {
      result.current.fetchUserPermissions('projectId', 'userId');
    });

    expect(requestGetUserOpPermissionSpy).toHaveBeenCalledWith({
      user_uid: 'userId',
      project_uid: 'projectId'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.isUserPermissionsFetched).toBeTruthy();
  });
});
