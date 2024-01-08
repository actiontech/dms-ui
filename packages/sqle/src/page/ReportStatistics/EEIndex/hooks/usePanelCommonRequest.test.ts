import { AxiosResponse } from 'axios';
import { cleanup, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import usePanelCommonRequest from './usePanelCommonRequest';

describe('ReportStatistics/usePanelCommonRequest', () => {
  const successFn = jest.fn();

  const mockPromiseAPI = (url: string) => {
    return new Promise<AxiosResponse<any>>((resolve, reject) => {
      url.includes('success')
        ? resolve(createSpySuccessResponse({ data: {} }))
        : resolve(createSpyFailResponse({ message: 'error-info' }));
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render request api when init hooks', async () => {
    const { result } = renderHook(() =>
      usePanelCommonRequest(() => mockPromiseAPI('success-url'), {
        onSuccess: successFn
      })
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(2700));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.errorMessage).toBe('');
  });

  it('render request api when api return error', async () => {
    const { result } = renderHook(() =>
      usePanelCommonRequest(() => mockPromiseAPI('error-url'), {
        onSuccess: successFn
      })
    );
    expect(result.current.errorMessage).toBe(undefined);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.errorMessage).toBe('error-info');
    expect(result.current.loading).toBeFalsy();
  });
});
