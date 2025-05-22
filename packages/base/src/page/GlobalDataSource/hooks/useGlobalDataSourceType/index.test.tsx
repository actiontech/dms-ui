import { act, renderHook, cleanup, render } from '@testing-library/react';
import useGlobalDataSourceType from '.';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { globalDBServicesTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { Select } from 'antd';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';

describe('useGlobalDataSourceType', () => {
  let listGlobalDBServicesTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseDbServiceDriver();
    listGlobalDBServicesTipsSpy = dbServices.listGlobalDBServicesTips();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get database type list from request', async () => {
    const { result } = renderHook(() => useGlobalDataSourceType());
    expect(result.current.loading).toBe(false);
    expect(result.current.dbTypeList).toEqual([]);

    act(() => {
      result.current.updateDbTypeList();
    });

    expect(result.current.loading).toBeTruthy();
    expect(listGlobalDBServicesTipsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbTypeList).toEqual(
      globalDBServicesTipsMockData.db_type
    );
    const { baseElement } = render(
      <Select open options={result.current.dbTypeOptions} />
    );

    await act(async () => await jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listGlobalDBServicesTipsSpy.mockClear();
    listGlobalDBServicesTipsSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useGlobalDataSourceType());
    act(() => {
      result.current.updateDbTypeList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbTypeList).toEqual([]);
    expect(result.current.dbTypeOptions).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listGlobalDBServicesTipsSpy.mockClear();
    listGlobalDBServicesTipsSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useGlobalDataSourceType());
    act(() => {
      result.current.updateDbTypeList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbTypeList).toEqual([]);
    expect(result.current.dbTypeOptions).toEqual([]);
  });
});
