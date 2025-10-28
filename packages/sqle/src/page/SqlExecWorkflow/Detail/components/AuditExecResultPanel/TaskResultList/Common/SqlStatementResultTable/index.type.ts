import { BasicTableProps } from '@actiontech/shared';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlStatementResultTableProps = Pick<
  BasicTableProps<IAuditTaskSQLResV2>,
  | 'pagination'
  | 'caption'
  | 'onChange'
  | 'errorMessage'
  | 'dataSource'
  | 'loading'
  | 'isPaginationFixed'
  | 'className'
> & {
  taskId?: string;
  instanceName?: string;
  schema?: string;
  enableSqlRetryExecute: boolean;
};
