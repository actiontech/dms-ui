import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useTableRequestParams,
  useTableFilterContainer
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import useAuditResultFilterParams from '../../../../Common/AuditResultFilterContainer/useAuditResultFilterParams';
import { AuditTaskExtraFilterMeta } from '../index.data';
import { GetAuditTaskSQLsPrams } from '../index.type';
import { useState } from 'react';
import { TaskResultListLayoutEnum } from '../index.enum';

const useTaskResultSetup = () => {
  const {
    noDuplicate,
    setAuditLevelFilterValue,
    setExecStatusFilterValue,
    setNoDuplicate,
    auditLevelFilterValue,
    execStatusFilterValue
  } = useAuditResultFilterParams();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    setPagination
  } = useTableRequestParams<IAuditTaskSQLResV2, GetAuditTaskSQLsPrams>();

  const { updateAllSelectedFilterItem, filterContainerMeta, filterButtonMeta } =
    useTableFilterContainer(
      [],
      updateTableFilterInfo,
      AuditTaskExtraFilterMeta()
    );

  const [currentListLayout, setCurrentListLayout] =
    useState<TaskResultListLayoutEnum>(TaskResultListLayoutEnum.pagination);

  const onTaskListLayoutChange = (value: TaskResultListLayoutEnum) => {
    setCurrentListLayout(value);
    if (value === TaskResultListLayoutEnum.pagination) {
      setPagination({ page_index: 1, page_size: 20 });
    }
  };

  return {
    noDuplicate,
    setAuditLevelFilterValue,
    setExecStatusFilterValue,
    setNoDuplicate,
    auditLevelFilterValue,
    execStatusFilterValue,
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    setPagination,
    updateAllSelectedFilterItem,
    filterContainerMeta,
    filterButtonMeta,
    currentListLayout,
    onTaskListLayoutChange
  };
};

export default useTaskResultSetup;
