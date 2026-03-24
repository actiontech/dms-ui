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
  title?: React.ReactNode;
};

interface SqlRewrittenDrawerBaseProps {
  maskClosable: boolean;
  width: number;
  title?: React.ReactNode;
}

export interface SqlRewrittenDrawerWithBaseProps
  extends SqlRewrittenDrawerBaseProps,
    SqlRewrittenDrawerProps {}
