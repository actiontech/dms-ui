import { act, cleanup } from '@testing-library/react';
import mockDMSGlobalApi from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import useSessionUser from '.';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({ pathname: '/mock-path' })
  };
});

describe('useSessionUser', () => {
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();
  let getUserBySessionSpy: jest.SpyInstance;
  let getCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    getUserBySessionSpy = mockDMSGlobalApi.getUserBySession();
    getCurrentUserSpy = mockDMSGlobalApi.getCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get use data from request', async () => {
    const { result } = superRenderHook(() => useSessionUser(), undefined, {
      initStore: {
        user: { uid: 'test' }
      }
    });
    expect(result.current.getSessionUserLoading).toBeFalsy();
    expect(result.current.sessionUser).toEqual(undefined);

    act(() => result.current.getUserBySession({}));
    expect(result.current.getSessionUserLoading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.sessionUser?.data).toEqual({
      code: 0,
      message: 'ok',
      name: 'test',
      user_uid: '300123'
    });
    expect(result.current.getSessionUserLoading).toBeFalsy();
  });
});
