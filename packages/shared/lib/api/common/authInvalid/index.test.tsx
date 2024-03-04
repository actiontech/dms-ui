import { act } from '@testing-library/react';
import globalAuthInvalid from '.';
import store from '../../../../../base/src/store';
import * as history from 'history';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('globalAuthInvalid', () => {
  const scopeDispatch = jest.fn();
  const createBrowserHistorySpy = jest.spyOn(history, 'createBrowserHistory');
  const historyPushSpy = jest.fn();
  const assignMock = jest.fn();
  const originLocation = window.location;
  Object.defineProperty(window, 'location', {
    value: {
      ...originLocation,
      hash: {
        endsWith: assignMock,
        includes: assignMock
      },
      assign: assignMock,
      reload: jest.fn()
    },
    writable: true
  });

  beforeEach(() => {
    store.dispatch = scopeDispatch;
    createBrowserHistorySpy.mockReturnValue({
      push: historyPushSpy
    } as any);
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
    assignMock.mockClear();
  });
  it('should work', async () => {
    act(() => {
      globalAuthInvalid();
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(scopeDispatch).toHaveBeenCalledTimes(6);
    expect(scopeDispatch).nthCalledWith(1, {
      payload: { token: '' },
      type: 'user/updateToken'
    });
    expect(scopeDispatch).nthCalledWith(2, {
      payload: { username: '', role: '' },
      type: 'user/updateUser'
    });
    expect(scopeDispatch).nthCalledWith(3, {
      payload: { uid: '' },
      type: 'user/updateUserUid'
    });
    expect(scopeDispatch).nthCalledWith(4, {
      payload: { managementPermissions: [] },
      type: 'user/updateManagementPermissions'
    });
    expect(scopeDispatch).nthCalledWith(5, {
      payload: { bindProjects: [] },
      type: 'user/updateBindProjects'
    });
    expect(window.location.href).toBe('/login?target=/');
  });
});
