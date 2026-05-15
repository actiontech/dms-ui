import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { TableProps } from 'antd';
import { TasksResultListBaseProps } from '../index.type';
import { TablePagination } from '@actiontech/dms-kit/es/components/ActiontechTable';

export type PaginationListProps = TasksResultListBaseProps & {
  pagination: TablePagination;
  tableChange: TableProps<IAuditTaskSQLResV2>['onChange'];
};
