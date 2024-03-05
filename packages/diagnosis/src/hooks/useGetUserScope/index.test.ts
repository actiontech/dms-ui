import { renderHooksWithReduxAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
import { act } from '@testing-library/react';
import useGetUserScope from '.';
import { useDispatch } from 'react-redux';
import user from '../../testUtils/mockApi/userManagement';
import { adminPermission } from '../../testUtils/mockApi/userManagement/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/useGetUserScope', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
    user.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const customRender = () => {
    return renderHooksWithReduxAndRouter(() => useGetUserScope(), {});
  };

  it('request get user info success', async () => {
    const request = user.getUserScope();
    const { result } = customRender();
    await act(() => {
      result.current.getUserScopeByRoleId({ role_id: '10000' });
    });
    expect(request).toHaveBeenCalled();
    expect(result.current.getUserScopeLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userScope?.data).toStrictEqual({
      code: 0,
      message: 'ok',
      data: adminPermission
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        userScope: adminPermission
      },
      type: 'user/updateUserScope'
    });
  });

  it('request get user info with nothing return', async () => {
    const request = user.getUserScope();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: undefined
      })
    );
    const { result } = customRender();
    await act(() => {
      result.current.getUserScopeByRoleId({ role_id: '10000' });
    });
    expect(request).toHaveBeenCalled();
    expect(result.current.getUserScopeLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userScope?.data).toStrictEqual({
      code: 0,
      message: 'ok',
      data: undefined
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
  });

  it('request get user info failed', async () => {
    const request = user.getUserScope();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const { result } = customRender();
    await act(() => {
      result.current.getUserScopeByRoleId({ role_id: '10000' });
    });
    expect(request).toHaveBeenCalled();
    expect(result.current.getUserScopeLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
