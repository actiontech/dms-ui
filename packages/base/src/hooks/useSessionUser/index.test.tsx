import { act, cleanup } from '@testing-library/react';
import mockDMSGlobalApi from '../../testUtils/mockApi/global';
import useSessionUser from '.';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch } from 'react-redux';
import { UserInfo } from '../../testUtils/mockApi/global/data';
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
    const { result } = renderHooksWithRedux(() => useSessionUser(), {
      user: { uid: 'test' }
    });
    expect(result.current.getSessionUserLoading).toBeFalsy();
    expect(result.current.sessionUser).toEqual(undefined);

    act(() => result.current.getUserBySession({}));
    expect(result.current.getSessionUserLoading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.sessionUser?.data).toEqual({
      code: 0,
      message: 'ok',
      data: { name: UserInfo.name, user_uid: UserInfo.userUid }
    });
    expect(result.current.getSessionUserLoading).toBeFalsy();
  });
});
