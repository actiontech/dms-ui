import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { act } from '@testing-library/react';
import useGetUserInfo from '.';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import user from '../../testUtils/mockApi/userManagement';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({ pathname: '/mock-path' })
  };
});

describe('diagnosis/useGetUserInfo', () => {
  const mockDispatch = jest.fn();
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    user.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const customRender = () => {
    return superRenderHook(() => useGetUserInfo(), {});
  };

  it('request get user info success', async () => {
    const request = user.getUserInfo();
    const getScopeRequest = user.getUserScope();
    const { result } = customRender();
    await act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toHaveBeenCalled();
    expect(result.current.getUserInfoLoading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.userInfo?.data).toStrictEqual({
      code: 0,
      data: {
        role_id: 10000,
        user_id: 1,
        username: 'admin'
      },
      message: 'ok'
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        username: 'admin',
        userId: '1',
        roleId: '10000'
      },
      type: 'user/updateUser'
    });
    expect(getScopeRequest).toHaveBeenCalled();
  });

  it('request get user info success but nothing return', async () => {
    const request = user.getUserInfo();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: undefined
      })
    );
    const { result } = customRender();
    act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
  });

  it('request get user info success but return error', async () => {
    const request = user.getUserInfo();
    request.mockImplementation(() =>
      createSpyFailResponse({
        code: 100,
        message: 'error'
      })
    );
    const { result } = customRender();
    act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('request get user info failed', async () => {
    const request = user.getUserInfo();
    request.mockImplementation(() => Promise.reject('error'));
    const { result } = customRender();
    act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toHaveBeenCalled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });
});
