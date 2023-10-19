import { useState } from 'react';
import { TableChange } from '~/types/common.type';
import { UseTablePaginationOption } from '..';

const useTablePagination = (options?: UseTablePaginationOption) => {
  const { defaultPageIndex = 1, defaultPageSize = 20 } = options ?? {};

  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [pageIndex, setPageIndex] = useState(defaultPageIndex);
  const [total, setTotal] = useState(0);

  const handleTablePaginationChange: TableChange = (page) => {
    if (typeof page.current === 'number' && page.current !== pageIndex) {
      setPageIndex(page.current);
    }
    if (typeof page.pageSize === 'number' && page.pageSize !== pageSize) {
      setPageSize(page.pageSize);
    }
  };

  return {
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    total,
    setTotal,
    handleTablePaginationChange
  };
};

export default useTablePagination;
