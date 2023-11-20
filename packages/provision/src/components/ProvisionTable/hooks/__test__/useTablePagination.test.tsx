import { act, renderHook } from '@testing-library/react';
import useTablePagination from '../useTablePagination';

describe('useTablePagination', () => {
  it('should have default value when user do not pass option', async () => {
    const { result } = renderHook(() => useTablePagination());
    expect(result.current.pageSize).toBe(20);
    expect(result.current.pageIndex).toBe(1);
    expect(result.current.total).toBe(0);
  });

  it('should set pageIndex and pageSize when user call setPageSize and setPageIndex', async () => {
    const { result } = renderHook(() => useTablePagination());
    expect(result.current.pageSize).toBe(20);
    expect(result.current.pageIndex).toBe(1);

    act(() => {
      result.current.setPageSize(50);
      result.current.setPageIndex(50);
      result.current.setTotal(10);
    });

    expect(result.current.pageSize).toBe(50);
    expect(result.current.pageIndex).toBe(50);
    expect(result.current.total).toBe(10);
  });

  it('should update pageSize and pageIndex when user call table change method', async () => {
    const { result } = renderHook(() => useTablePagination());
    expect(result.current.pageSize).toBe(20);
    expect(result.current.pageIndex).toBe(1);

    act(() => {
      result.current.handleTablePaginationChange(
        {
          current: 20,
          pageSize: 100
        },
        {},
        {},
        {} as any
      );
    });

    expect(result.current.pageSize).toBe(100);
    expect(result.current.pageIndex).toBe(20);
  });
});
