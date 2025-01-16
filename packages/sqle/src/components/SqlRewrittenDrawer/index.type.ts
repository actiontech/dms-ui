export type SqlRewrittenDrawerProps = {
  open: boolean;
  onClose: () => void;
  taskID: string;
  originSqlInfo?: { sql: string; number: number };
};

interface SqlRewrittenDrawerBaseProps {
  maskClosable: boolean;
  width: number;
  title: string;
}

export interface SqlRewrittenDrawerWithBaseProps
  extends SqlRewrittenDrawerBaseProps,
    SqlRewrittenDrawerProps {}
