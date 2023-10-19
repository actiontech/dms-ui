import { TableProps } from 'antd5';
import { useCallback, useState } from 'react';
import { TablePagination, UseTableRequestParamsOptions } from '../index.type';
import { SorterResult } from 'antd5/es/table/interface';

const useTableRequestParams = <
  R extends Record<string, any>,
  F = Record<string, any>
>(
  option?: UseTableRequestParamsOptions<F>
) => {
  const {
    defaultPageSize = 20,
    defaultPageIndex = 1,
    defaultFilterInfo = {} as F
  } = option ?? {};

  const [tableFilterInfo, updateTableFilterInfo] =
    useState<F>(defaultFilterInfo);
  const [pagination, setPagination] = useState<TablePagination>({
    page_index: defaultPageIndex,
    page_size: defaultPageSize
  });

  const [sortInfo, setSortInfo] = useState<SorterResult<R> | SorterResult<R>[]>(
    {}
  );
  /**
   * TODO:
   * 暂时没有确认模糊查询字段名
   */
  const createSearchParams = <T extends { fuzzy_keyword?: string } & F>(
    params: T,
    search: string
  ) => {
    if (search === '') {
      return;
    }
    params.fuzzy_keyword = search;
  };

  const createSortParams = <
    T extends { order_by?: string; is_asc?: boolean } & F
  >(
    params: T
  ) => {
    if (Array.isArray(sortInfo)) {
      const _sortInfo = sortInfo[0];
      if (!!_sortInfo.order && !!_sortInfo.field) {
        params.order_by = Array.isArray(_sortInfo.field)
          ? _sortInfo.field[0]
          : _sortInfo.field;
        params.is_asc = _sortInfo.order === 'ascend';
      }
    } else if (!!sortInfo.order && !!sortInfo.field) {
      params.order_by = Array.isArray(sortInfo.field)
        ? sortInfo.field[0]
        : sortInfo.field;
      params.is_asc = sortInfo.order === 'ascend';
    }
  };

  const tableChange = useCallback<Required<TableProps<R>>['onChange']>(
    (newPagination, _, sort) => {
      setSortInfo(sort);
      if (
        newPagination.current !== pagination.page_index ||
        newPagination.pageSize !== pagination.page_size
      ) {
        setPagination({
          page_index: newPagination.current ?? defaultPageIndex,
          page_size: newPagination.pageSize ?? defaultPageSize
        });
      }
    },
    [
      defaultPageIndex,
      defaultPageSize,
      pagination.page_index,
      pagination.page_size
    ]
  );

  return {
    tableFilterInfo,
    updateTableFilterInfo,
    pagination,
    createSearchParams,
    tableChange,
    sortInfo,
    createSortParams,
    setPagination
  };
};

export default useTableRequestParams;
