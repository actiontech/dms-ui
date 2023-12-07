import { renderHook, act, cleanup } from '@testing-library/react';
import useTableRequestParams from '../useTableRequestParams';

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
    await act(async () => {
      const sortInfo = result.current.sortInfo;
      expect(sortInfo).toEqual({});

      result.current.createSortParams({
        order_by: 'aa',
        field: 'aa',
        is_asc: true
      });
      expect(sortInfo).toEqual({});
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
