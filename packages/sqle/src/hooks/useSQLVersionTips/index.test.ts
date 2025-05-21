import { act, renderHook, cleanup } from '@testing-library/react-hooks';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import useSQLVersionTips from '.';
import { getSqlVersionListV1MockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('sqle/useSQLVersionTips', () => {
  let getSqlVersionListSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseCurrentProject();
    getSqlVersionListSpy = sqlVersion.mockGetSqlVersionListV1();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render get version list from request', async () => {
    const { result } = renderHook(() => useSQLVersionTips());

    expect(result.current.loading).toBeFalsy();
    expect(result.current.sqlVersionList).toEqual([]);
    expect(result.current.sqlVersionOptions).toEqual([]);

    act(() => {
      result.current.updateSqlVersionList();
    });
    expect(result.current.loading).toBeTruthy();
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBeFalsy();
    expect(result.current.sqlVersionList).toEqual(
      getSqlVersionListV1MockData.data
    );
    expect(result.current.sqlVersionOptions).toEqual(
      getSqlVersionListV1MockData.data?.map((i) => ({
        label: i.version,
        value: i.version_id
      }))
    );
  });

  it('render response code is not equal success code', async () => {
    getSqlVersionListSpy.mockClear();
    getSqlVersionListSpy.mockImplementation(() => createSpyFailResponse({}));
    const { result } = renderHook(() => useSQLVersionTips());
    act(() => {
      result.current.updateSqlVersionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.sqlVersionList).toEqual([]);
    expect(result.current.sqlVersionOptions).toEqual([]);
  });

  it('render response throw error', async () => {
    getSqlVersionListSpy.mockClear();
    getSqlVersionListSpy.mockImplementation(() => createSpyErrorResponse({}));
    const { result } = renderHook(() => useSQLVersionTips());
    act(() => {
      result.current.updateSqlVersionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.sqlVersionList).toEqual([]);
    expect(result.current.sqlVersionOptions).toEqual([]);
  });
});
