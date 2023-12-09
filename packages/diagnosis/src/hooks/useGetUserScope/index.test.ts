import { renderHooksWithReduxAndRouter } from '../../testUtils/customRender';
import { act } from '@testing-library/react';
import useGetUserScope from '.';
import { useDispatch } from 'react-redux';
import user from '../../testUtils/mockApi/user';
import { userScopeData } from '../../testUtils/mockApi/user/data';

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
    expect(request).toBeCalled();
    expect(result.current.getUserScopeLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userScope?.data).toStrictEqual({
      code: 0,
      msg: 'ok',
      data: userScopeData
    });
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        userScope: userScopeData
      },
      type: 'user/updateUserScope'
    });
  });
});
