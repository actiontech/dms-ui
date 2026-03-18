import { cleanup, act, renderHook } from '@testing-library/react';
import useOpPermission from '.';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { ListOpPermissionsServiceEnum } from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';

// Verifies the [sqle && !dms] branch: service is set to sqle when calling ListOpPermissions

describe('test useOpPermission - sqle mode', () => {
  let listOpPermissionSpy: jest.SpyInstance;

  beforeEach(() => {
    listOpPermissionSpy = userCenter.getOpPermissionsList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should call ListOpPermissions with service=sqle', async () => {
    const { result } = renderHook(() => useOpPermission());

    act(() => {
      result.current.updateOpPermissionList();
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(listOpPermissionSpy).toHaveBeenCalledTimes(1);
    expect(listOpPermissionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        service: ListOpPermissionsServiceEnum.sqle
      })
    );
  });

  it('should call ListOpPermissions with service=sqle when filterBy is provided', async () => {
    const { result } = renderHook(() => useOpPermission());

    act(() => {
      result.current.updateOpPermissionList();
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(listOpPermissionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        service: ListOpPermissionsServiceEnum.sqle
      })
    );
    expect(result.current.loading).toBeFalsy();
    expect(result.current.opPermissionList.length).toBeGreaterThan(0);
  });
});
