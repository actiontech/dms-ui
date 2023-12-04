import useProvisionUser from '.';
import { act, cleanup } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import auth from '../../testUtil/mockApi/auth';
import { userList } from '../../testUtil/mockApi/auth/data';
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
  const mockUserNameOptions = userList.map((i) => ({
    value: i.name,
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
    const { result } = renderHooksWithRedux(() => useProvisionUser(), {});
    
    expect(result.current.loading).toBeFalsy();
    expect(result.current.userList).toEqual([]);
    expect(result.current.userNameOptions).toEqual([]);
    expect(result.current.userOptions).toEqual([]);

    act(() => result.current.updateUserList());

    expect(result.current.loading).toBeTruthy();
    expect(authListUserSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.userList).toEqual(userList);
    expect(result.current.userOptions).toEqual(mockUserOptions);
    expect(result.current.userNameOptions).toEqual(mockUserNameOptions);
  });

  it(
    'should set userList to empty array when response code is not equal success code', async () => {
       authListUserSpy.mockClear();
       authListUserSpy.mockImplementation(() =>
         createSpyFailResponse({ data: [] })
       );
      
      const { result } = renderHooksWithRedux(() => useProvisionUser(), {});
      act(() => result.current.updateUserList());
      await act(async () => jest.advanceTimersByTime(3000));
      expect(result.current.userList).toEqual([]);
    }
  );

  it('should set userList to empty array when response throw error', async () => {
    authListUserSpy.mockClear();
    authListUserSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(() => useProvisionUser(), {});
    act(() => result.current.updateUserList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userList).toEqual([]);
  });
});
