import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IBasicTable } from '@actiontech/shared/lib/components/BasicTable';

export type SqlStatementResultTableProps = Pick<
  IBasicTable<IAuditTaskSQLResV2>,
  | 'pagination'
  | 'caption'
  | 'onChange'
  | 'errorMessage'
  | 'dataSource'
  | 'loading'
  | 'isPaginationFixed'
  | 'className'
> & { taskId?: string };
