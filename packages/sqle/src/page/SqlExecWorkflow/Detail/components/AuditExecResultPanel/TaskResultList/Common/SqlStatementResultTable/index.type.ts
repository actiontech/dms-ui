import { BasicTableProps } from '@actiontech/dms-kit/es/components/BasicTable/BasicTable.types';
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
> & { taskId?: string; instanceName?: string; schema?: string };
