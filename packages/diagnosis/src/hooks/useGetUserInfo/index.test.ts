import { renderHooksWithReduxAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
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
    return renderHooksWithReduxAndRouter(() => useGetUserInfo(), {});
  };

  it('request get user info success', async () => {
    const request = user.getUserInfo();
    const getScopeRequest = user.getUserScope();
    const { result } = customRender();
    await act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toBeCalled();
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
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        username: 'admin',
        userId: '1',
        roleId: '10000'
      },
      type: 'user/updateUser'
    });
    expect(getScopeRequest).toBeCalled();
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
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
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
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith('/login', { replace: true });
  });

  it('request get user info failed', async () => {
    const request = user.getUserInfo();
    request.mockImplementation(() => Promise.reject('error'));
    const { result } = customRender();
    act(() => {
      result.current.getUserInfo({ user_id: '1' });
    });
    expect(request).toBeCalled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalledTimes(3);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toBeCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith('/login', { replace: true });
  });
});
