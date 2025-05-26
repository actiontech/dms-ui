import useProvisionUser from '.';
import { act, cleanup } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import auth from '@actiontech/shared/lib/testUtil/mockApi/provision/auth';
import { userList } from '@actiontech/shared/lib/testUtil/mockApi/provision/auth/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/hooks/useProvisionUser', () => {
  let authListUserSpy: jest.SpyInstance;
  const mockUserOptions = userList.map((i) => ({
    value: i.user_uid,
    label: i.name
  }));

  beforeEach(() => {
    jest.useFakeTimers();
    authListUserSpy = auth.listUsers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get provision user data from request', async () => {
    const { result } = superRenderHook(() => useProvisionUser(), {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.userList).toEqual([]);
    expect(result.current.userNameOptions).toEqual([]);
    expect(result.current.userIDOptions).toEqual([]);
    expect(result.current.userOptions).toEqual([]);

    act(() => result.current.updateUserList());

    expect(result.current.loading).toBeTruthy();
    expect(authListUserSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.userList).toEqual(userList);
    expect(result.current.userOptions).toEqual(mockUserOptions);
    expect(result.current.userNameOptions).toMatchSnapshot();
    expect(result.current.userIDOptions).toMatchSnapshot();
  });

  it('should set userList to empty array when response code is not equal success code', async () => {
    authListUserSpy.mockClear();
    authListUserSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );

    const { result } = superRenderHook(() => useProvisionUser(), {});
    act(() => result.current.updateUserList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userList).toEqual([]);
  });

  it('should set userList to empty array when response throw error', async () => {
    authListUserSpy.mockClear();
    authListUserSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = superRenderHook(() => useProvisionUser(), {});
    act(() => result.current.updateUserList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userList).toEqual([]);
  });
});
