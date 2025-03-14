import { act } from '@testing-library/react';
import { redirectToLogin, refreshAuthToken } from '.';
import store from '../../../../../base/src/store';
import * as history from 'history';
import axios from 'axios';
import { ResponseCode } from '../../../enum';
import { eventEmitter } from '../../../utils/EventEmitter';

jest.mock('axios');
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

jest.mock('../../../utils/EventEmitter', () => ({
  eventEmitter: {
    emit: jest.fn()
  }
}));

describe('authInvalid', () => {
  const scopeDispatch = jest.fn();
  const createBrowserHistorySpy = jest.spyOn(history, 'createBrowserHistory');
  const historyPushSpy = jest.fn();
  const assignMock = jest.fn();
  const originLocation = window.location;

  beforeEach(() => {
    store.dispatch = scopeDispatch;
    createBrowserHistorySpy.mockReturnValue({
      push: historyPushSpy
    } as any);

    Object.defineProperty(window, 'location', {
      value: {
        ...originLocation,
        pathname: '/',
        search: '',
        hash: {
          endsWith: assignMock,
          includes: assignMock
        },
        assign: assignMock,
        reload: jest.fn(),
        href: ''
      },
      writable: true
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
    assignMock.mockClear();
  });

  describe('redirectToLogin', () => {
    it('should redirect to login and clear user state', async () => {
      act(() => {
        redirectToLogin();
      });

      await act(async () => jest.advanceTimersByTime(1000));

      expect(scopeDispatch).toHaveBeenCalledTimes(6);
      expect(scopeDispatch).toHaveBeenNthCalledWith(1, {
        payload: { token: '' },
        type: 'user/updateToken'
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(2, {
        payload: { username: '', role: '' },
        type: 'user/updateUser'
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(3, {
        payload: { uid: '' },
        type: 'user/updateUserUid'
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(4, {
        payload: { managementPermissions: [] },
        type: 'user/updateManagementPermissions'
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(5, {
        payload: { bindProjects: [] },
        type: 'user/updateBindProjects'
      });
      expect(window.location.href).toBe(
        `/login?target=${encodeURIComponent('/')}`
      );
    });

    it('should not redirect when already on login page', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: '/login'
        },
        writable: true
      });

      act(() => {
        redirectToLogin();
      });

      await act(async () => jest.advanceTimersByTime(1000));

      expect(scopeDispatch).not.toHaveBeenCalled();
    });

    it('should include search params in redirect url', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          pathname: '/dashboard',
          search: '?param=value'
        },
        writable: true
      });

      act(() => {
        redirectToLogin();
      });

      await act(async () => jest.advanceTimersByTime(1000));

      expect(window.location.href).toBe(
        `/login?target=${encodeURIComponent('/dashboard?param=value')}`
      );
    });
  });

  describe('refreshAuthToken', () => {
    it('should update token on successful response', async () => {
      const mockResponse = {
        status: 200,
        data: {
          code: ResponseCode.SUCCESS,
          data: {
            token: 'new-token'
          }
        }
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        refreshAuthToken();
        await jest.runAllTimers();
      });

      expect(axios.post).toHaveBeenCalledWith('/v1/dms/sessions/refresh');
      expect(scopeDispatch).toHaveBeenCalledWith({
        payload: { token: 'Bearer new-token' },
        type: 'user/updateToken'
      });
    });

    it('should not send multiple requests when called multiple times', async () => {
      const mockResponse = {
        status: 200,
        data: {
          code: ResponseCode.SUCCESS,
          data: {
            token: 'new-token'
          }
        }
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        // 连续调用三次
        const promise1 = refreshAuthToken();
        const promise2 = refreshAuthToken();
        const promise3 = refreshAuthToken();

        // 确保所有Promise都完成
        await Promise.all([promise1, promise2, promise3]);
        await jest.runAllTimers();
      });

      // 验证只发起了一次请求
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/v1/dms/sessions/refresh');
      expect(scopeDispatch).toHaveBeenCalledTimes(1);
    });

    it('should reset refreshing state after completion', async () => {
      const mockResponse1 = {
        status: 200,
        data: {
          code: ResponseCode.SUCCESS,
          data: {
            token: 'new-token-1'
          }
        }
      };

      const mockResponse2 = {
        status: 200,
        data: {
          code: ResponseCode.SUCCESS,
          data: {
            token: 'new-token-2'
          }
        }
      };

      (axios.post as jest.Mock)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      await act(async () => {
        // 第一次调用
        await refreshAuthToken();
        await jest.runAllTimers();

        // 第二次调用（应该发起新请求）
        await refreshAuthToken();
        await jest.runAllTimers();
      });

      // 验证发起了两次请求
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(scopeDispatch).toHaveBeenCalledTimes(2);
      expect(scopeDispatch).toHaveBeenNthCalledWith(1, {
        payload: { token: 'Bearer new-token-1' },
        type: 'user/updateToken'
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(2, {
        payload: { token: 'Bearer new-token-2' },
        type: 'user/updateToken'
      });
    });

    it('should redirect to login on 401 response', async () => {
      const mockResponse = {
        status: 401
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        refreshAuthToken();
        await jest.runAllTimers();
      });

      expect(window.location.href).toBe(
        `/login?target=${encodeURIComponent('/')}`
      );
    });

    it('should show notification on error response', async () => {
      const mockResponse = {
        status: 200,
        data: {
          code: 1,
          message: 'Error message'
        }
      };

      (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      await act(async () => {
        refreshAuthToken();
        await jest.runAllTimers();
      });

      expect(eventEmitter.emit).toHaveBeenCalled();
    });

    it('should handle network error', async () => {
      const error = new Error('Network error');

      (axios.post as jest.Mock).mockRejectedValueOnce(error);

      await act(async () => {
        try {
          await refreshAuthToken();
        } catch (e) {}
        await jest.runAllTimers();
      });

      expect(eventEmitter.emit).toHaveBeenCalled();
    });

    it('should redirect to login on 401 error response', async () => {
      const error = {
        response: {
          status: 401
        }
      };

      (axios.post as jest.Mock).mockRejectedValueOnce(error);

      await act(async () => {
        try {
          await refreshAuthToken();
        } catch (e) {}
        await jest.runAllTimers();
      });

      expect(window.location.href).toBe(
        `/login?target=${encodeURIComponent('/')}`
      );
    });
  });
});
