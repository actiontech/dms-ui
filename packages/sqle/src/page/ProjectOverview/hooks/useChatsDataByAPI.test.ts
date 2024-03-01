import { cleanup, renderHook } from '@testing-library/react-hooks';
import useChatsDataByAPI from './useChatsDataByAPI';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { act } from '@testing-library/react';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

describe('useChatsDataByAPI', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const mockSuccess = jest.fn();

  const successData = { code: 0, message: 'ok', data: '12' };
  const errorMessage = 'error info';
  const failedData = { code: 500, message: errorMessage };
  const unknownError = '未知错误...';

  const responseDataObject = {
    status: 200,
    headers: {},
    config: {},
    statusText: '',
    data: successData
  };

  test('request success', async () => {
    const { result } = renderHook(() =>
      useChatsDataByAPI(() => createSpySuccessResponse(successData), {
        onSuccess: mockSuccess
      })
    );
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(mockSuccess).toHaveBeenCalledWith(responseDataObject);
    expect(result.current.errorMessage).toBe('');

    await act(async () => result.current.getApiData());
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
  });

  test('request success with failed code', async () => {
    const { result } = renderHook(() =>
      useChatsDataByAPI(() => createSpySuccessResponse(failedData), {
        onSuccess: mockSuccess
      })
    );
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe(errorMessage);
  });

  test('request success with failed code and return unknown error', async () => {
    const { result } = renderHook(() =>
      useChatsDataByAPI(
        () => createSpySuccessResponse({ ...failedData, message: undefined }),
        {
          onSuccess: mockSuccess
        }
      )
    );
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Project_Overview)
    );
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe(unknownError);
  });

  test('request failed', async () => {
    const { result } = renderHook(() =>
      useChatsDataByAPI(
        () =>
          createSpyErrorResponse(failedData).catch((error) =>
            Promise.reject(error?.data?.message)
          ),
        {
          onSuccess: mockSuccess
        }
      )
    );
    await act(async () => result.current.getApiData());
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toBe(errorMessage);
  });

  test('request failed and return unknown error', async () => {
    const { result } = renderHook(() =>
      useChatsDataByAPI(
        () =>
          createSpyErrorResponse({ ...failedData, message: undefined }).catch(
            (error) => Promise.reject(error?.data?.message)
          ),
        {
          onSuccess: mockSuccess
        }
      )
    );
    await act(async () => result.current.getApiData());
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.errorMessage).toBe(unknownError);
  });
});
