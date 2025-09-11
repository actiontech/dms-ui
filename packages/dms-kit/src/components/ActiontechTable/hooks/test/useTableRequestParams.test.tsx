import { renderHook, act, cleanup } from '@testing-library/react';
import useTableRequestParams from '../useTableRequestParams';
import { PaginationProps } from 'antd';

describe('lib/ActiontechTable-hooks-useTableRequestParams', () => {
  beforeEach(() => {
    cleanup();
  });

  it('render init data', async () => {
    const { result } = renderHook(() => useTableRequestParams());
    await act(async () => {
      const pagination = result.current.pagination;
      expect(pagination.page_size).toBe(20);
      expect(pagination.page_index).toBe(1);

      const sortInfo = result.current.sortInfo;
      expect(sortInfo).toEqual({});

      const searchKeyword = result.current.searchKeyword;
      expect(searchKeyword).toEqual('');
    });
  });

  it('render use createSearchParams', async () => {
    const { result } = renderHook(() => useTableRequestParams());
    await act(async () => {
      const mockSearchParams = {
        fuzzy_keyword: '11'
      };
      result.current.createSearchParams(mockSearchParams, '');
      expect(mockSearchParams.fuzzy_keyword).toBe('11');

      result.current.createSearchParams(mockSearchParams, '22');
      expect(mockSearchParams.fuzzy_keyword).toBe('22');
    });
  });

  it('render use createSortParams', async () => {
    const { result } = renderHook(() => useTableRequestParams());
    const params: { order_by?: string; is_asc?: boolean } = {};
    result.current.createSortParams(params);
    expect(params).toEqual({});

    await act(async () => {
      result.current.tableChange(
        {} as PaginationProps,
        {} as Record<string, null>,
        {
          column: {
            dataIndex: 'query_time_max',
            title: '最长执行时间',
            sorter: true
          },
          order: 'ascend',
          field: 'query_time_max'
        },
        {} as any
      );
    });

    expect(result.current.sortInfo).toEqual({
      column: {
        dataIndex: 'query_time_max',
        title: '最长执行时间',
        sorter: true
      },
      order: 'ascend',
      field: 'query_time_max'
    });

    result.current.createSortParams(params);
    expect(params).toEqual({
      is_asc: true,
      order_by: 'query_time_max'
    });

    await act(async () => {
      result.current.tableChange(
        {} as PaginationProps,
        {} as Record<string, null>,
        [
          {
            column: {
              dataIndex: 'last_receive_timestamp',
              title: '最后匹配时间',
              sorter: true
            },
            order: 'descend',
            field: 'last_receive_timestamp'
          }
        ],
        {} as any
      );
    });

    result.current.createSortParams(params);
    expect(params).toEqual({
      is_asc: false,
      order_by: 'last_receive_timestamp'
    });
  });

  describe('render reset page index 1 when filter ui info data change ', () => {
    it('render use refreshBySearchKeyword when fuzzy text onEnter', async () => {
      const { result } = renderHook(() => useTableRequestParams());
      expect(result.current.pagination).toEqual({
        page_index: 1,
        page_size: 20
      });
      await act(async () => {
        result.current.setPagination({
          page_index: 10,
          page_size: 50
        });
      });
      expect(result.current.pagination).toEqual({
        page_index: 10,
        page_size: 50
      });
      await act(async () => {
        result.current.refreshBySearchKeyword();
      });
      await act(async () => {
        result.current.setPagination({
          page_index: 1,
          page_size: 50
        });
      });
    });

    it('render use updateTableFilterInfo when filter info change', async () => {
      const { result } = renderHook(() => useTableRequestParams());
      expect(result.current.pagination).toEqual({
        page_index: 1,
        page_size: 20
      });
      expect(result.current.tableFilterInfo).toEqual({});
      await act(async () => {
        result.current.updateTableFilterInfo({});
      });
      expect(result.current.pagination).toEqual({
        page_index: 1,
        page_size: 20
      });

      await act(async () => {
        result.current.setPagination({
          page_index: 10,
          page_size: 50
        });
      });
      expect(result.current.pagination).toEqual({
        page_index: 10,
        page_size: 50
      });
      await act(async () => {
        result.current.updateTableFilterInfo(() => ({ a: 1 }));
      });
      expect(result.current.pagination).toEqual({
        page_index: 1,
        page_size: 50
      });
      expect(result.current.tableFilterInfo).toEqual({ a: 1 });

      await act(async () => {
        result.current.setPagination({
          page_index: 9,
          page_size: 50
        });
      });
      expect(result.current.pagination).toEqual({
        page_index: 9,
        page_size: 50
      });
      await act(async () => {
        result.current.updateTableFilterInfo({ b: 2 });
      });
      expect(result.current.pagination).toEqual({
        page_index: 1,
        page_size: 50
      });
      expect(result.current.tableFilterInfo).toEqual({ b: 2 });
    });
  });
});
