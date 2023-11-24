import { cleanup, renderHook, act } from '@testing-library/react';
import useUserGroup from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import { userGroupList } from '../../testUtils/mockApi/userCenter/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useUserGroup', () => {
  let listUserGroupSpy: jest.SpyInstance;
  beforeEach(() => {
    listUserGroupSpy = userCenter.getUserGroupList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get user group data from request', async () => {
    const { result } = renderHook(() => useUserGroup());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.userGroupList).toEqual([]);

    act(() => {
      result.current.updateUserGroupList();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userGroupList).toEqual([]); // userGroupList
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listUserGroupSpy.mockClear();
    listUserGroupSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useUserGroup());
    act(() => {
      result.current.updateUserGroupList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userGroupList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listUserGroupSpy.mockClear();
    listUserGroupSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useUserGroup());
    act(() => {
      result.current.updateUserGroupList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userGroupList).toEqual([]);
  });
});
