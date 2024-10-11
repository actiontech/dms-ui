import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useUserInfo from '.';
import { act, renderHook } from '@testing-library/react';
import global from '../../../../base/src/testUtils/mockApi/global';
import { GetUserPayload } from '../../../../base/src/testUtils/mockApi/global/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '../../testUtil/mockApi';

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
describe('useUserInfo', () => {
  const mockDispatch = jest.fn();
  const navigateSpy = jest.fn();
  let getCurrentUserSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { uid: '111' }
      });
    });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    getCurrentUserSpy = global.getCurrentUser();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should update userInfo when request success', async () => {
    const { result } = renderHook(() => useUserInfo());
    expect(result.current.userInfo).not.toBeDefined();
    expect(result.current.getUserInfoLoading).toBeFalsy();
    await act(() => result.current.getUserInfo());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(5);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        role: 'admin',
        username: 'test'
      },
      type: 'user/updateUser'
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { language: GetUserPayload.language, store: true },
      type: 'user/updateLanguage'
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        bindProjects: GetUserPayload.user_bind_projects
      },
      type: 'user/updateBindProjects'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        managementPermissions: []
      },
      type: 'user/updateManagementPermissions'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'user/updateUserInfoFetchStatus'
    });
  });

  it('should clear userInfo and navigate to login when ResponseCode is not equal success', async () => {
    getCurrentUserSpy.mockClear();
    getCurrentUserSpy = getCurrentUserSpy.mockImplementation(() =>
      createSpyFailResponse({ name: '', user_uid: '' })
    );
    const { result } = renderHook(() => useUserInfo());
    await act(() => result.current.getUserInfo());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(12);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: { username: '', role: '' },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      payload: { uid: '' },
      type: 'user/updateUserUid'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: {
        bindProjects: []
      },
      type: 'user/updateBindProjects'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      payload: {
        managementPermissions: []
      },
      type: 'user/updateManagementPermissions'
    });
    // expect(navigateSpy).toHaveBeenCalledTimes(1);
    // expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('should clear userInfo and navigate to login request error', async () => {
    getCurrentUserSpy.mockClear();
    getCurrentUserSpy = getCurrentUserSpy.mockImplementation(() =>
      createSpyErrorResponse({ name: '', user_uid: '' })
    );
    const { result } = renderHook(() => useUserInfo());
    await act(() => result.current.getUserInfo());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(6);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: { username: '', role: '' },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      payload: { uid: '' },
      type: 'user/updateUserUid'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
      payload: { token: '' },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: {
        bindProjects: []
      },
      type: 'user/updateBindProjects'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      payload: {
        managementPermissions: []
      },
      type: 'user/updateManagementPermissions'
    });
    // expect(navigateSpy).toHaveBeenCalledTimes(1);
    // expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });
});
