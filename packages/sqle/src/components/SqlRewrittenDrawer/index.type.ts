import { IRewriteSQLData } from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlRewrittenDrawerProps = {
  open: boolean;
  onClose: () => void;
  taskID: string;
  mockData?: IRewriteSQLData;
  originSqlInfo?: {
    sql: string;
    number: number;
    instanceName?: string;
    schema?: string;
  };
};

interface SqlRewrittenDrawerBaseProps {
  maskClosable: boolean;
  width: number;
  title: string;
}

export interface SqlRewrittenDrawerWithBaseProps
  extends SqlRewrittenDrawerBaseProps,
    SqlRewrittenDrawerProps {}
