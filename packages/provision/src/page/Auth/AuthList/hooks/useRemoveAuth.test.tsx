import { act, cleanup } from '@testing-library/react';
import { sleep } from '~/testUtil/customQuery';
import { superRenderHooks } from '~/testUtil/customRender';
import mockApi from '~/testUtil/mockApi';
import useRemoveAuth from './useRemoveAuth';
import auth from '~/testUtil/mockApi/auth';

describe('useRemoveAuth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  it('debounce remove auth request', async () => {
    const deleteAuthSpy = auth.removeAuthorization();
    const refresh = jest.fn();
    const { result } = superRenderHooks(() => useRemoveAuth(refresh));

    await act(() => {
      result.current.removeAuth({
        uid: '123'
      });

      result.current.removeAuth({
        uid: '123'
      });
    });
    expect(deleteAuthSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(refresh).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(1000));

    await act(() => {
      result.current.removeAuth({
        uid: '123'
      });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteAuthSpy).toBeCalledTimes(2);
    expect(refresh).toBeCalledTimes(2);
  }, 30000);
});
