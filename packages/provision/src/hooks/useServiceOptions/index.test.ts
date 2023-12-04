import auth from '../../testUtil/mockApi/auth';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useServiceOptions from '.';
import { act, cleanup } from '@testing-library/react';
import { instanceList } from '../../testUtil/mockApi/auth/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';


describe('provision/hooks/useServiceOptions', () => {
  let authListServicesSpy: jest.SpyInstance;
  const serviceOptions = instanceList.map((i) => ({
    label: i.name,
    value: i.uid
  }));
  const serviceNameOptions = instanceList.map((i) => ({
    label: i.name,
    value: i.name
  }));
  const business = 'business-1';
  beforeEach(() => {
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get service data from request', async () => {
    const { result } = renderHooksWithRedux(useServiceOptions, {});

    expect(result.current.loading).toBeFalsy();
    expect(result.current.serviceList).toEqual([]);
    expect(result.current.serviceOptions).toEqual([]);
    expect(result.current.serviceNameOptions).toEqual([]);

    act(() => {
      result.current.updateServiceList(business);
    });

    expect(result.current.loading).toBeTruthy();
    expect(authListServicesSpy).toBeCalledTimes(1);
    expect(authListServicesSpy).toBeCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_namespace:'',
      business
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.serviceList).toEqual(instanceList);
    expect(result.current.serviceOptions).toEqual(serviceOptions);
    expect(result.current.serviceNameOptions).toEqual(serviceNameOptions);
  });

  it('should set serviceList to empty array when response code is not equal success code', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );

    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() => result.current.updateServiceList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.serviceList).toEqual([]);
  });

  it('should set serviceList to empty array when response throw error', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(useServiceOptions, {});
    act(() => result.current.updateServiceList());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.serviceList).toEqual([]);
  });
});
