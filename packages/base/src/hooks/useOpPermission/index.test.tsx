import { cleanup, act, renderHook } from '@testing-library/react';
import useOpPermission from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import { opPermissionList } from '../../testUtils/mockApi/userCenter/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('test useManagerPermission', () => {
  let listOpPermissionSpy: jest.SpyInstance;
  beforeEach(() => {
    listOpPermissionSpy = userCenter.getOpPermissionsList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get op permission list from request', async () => {
    const { result } = renderHook(() => useOpPermission());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.opPermissionList).toEqual([]);

    act(() => {
      result.current.updateOpPermissionList();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual([]); // opPermissionList
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listOpPermissionSpy.mockClear();
    listOpPermissionSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useOpPermission());
    act(() => {
      result.current.updateOpPermissionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listOpPermissionSpy.mockClear();
    listOpPermissionSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useOpPermission());
    act(() => {
      result.current.updateOpPermissionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual([]);
  });
});
