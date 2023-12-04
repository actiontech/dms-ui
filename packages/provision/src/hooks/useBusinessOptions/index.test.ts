import auth from '../../testUtil/mockApi/auth';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useBusinessOptions from '.';
import { act, cleanup } from '@testing-library/react';
import { businesses } from '../../testUtil/mockApi/auth/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/hooks/useBusinessOptions', () => {
  let authListBusinessSpy: jest.SpyInstance;
  const businessOptions = businesses.map((i) => ({
    label: i,
    value: i
  }));
  beforeEach(() => {
    jest.useFakeTimers();
    authListBusinessSpy = auth.listBusinesses();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  })

  it('should get business data from request', async () => {
    const { result } = renderHooksWithRedux(useBusinessOptions, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.businessList).toEqual([]);
    expect(result.current.businessOptions).toEqual([]);

    act(() => {
      result.current.updateBusinessList();
    });

    expect(result.current.loading).toBeTruthy();
    expect(authListBusinessSpy).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.businessList).toEqual(businesses);
    expect(result.current.businessOptions).toEqual(businessOptions);
  });

  it('should set businessList to empty array when response code is not equal success code', async () => {
    authListBusinessSpy.mockClear();
    authListBusinessSpy.mockImplementation(() =>
      createSpyFailResponse({ data: { business: [] } })
    );

    const { result } = renderHooksWithRedux(useBusinessOptions, {});
    act(() => result.current.updateBusinessList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.businessList).toEqual([]);
  });

  it('should set businessList to empty array when response throw error', async () => {
    authListBusinessSpy.mockClear();
    authListBusinessSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: { business: []} })
    );
    const { result } = renderHooksWithRedux(useBusinessOptions, {});
    act(() => result.current.updateBusinessList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.businessList).toEqual([]);
  });
});
