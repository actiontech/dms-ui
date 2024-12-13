export type SqlRewrittenDrawerProps = {
  open: boolean;
  onClose: () => void;
  taskID: string;
  originSqlInfo?: { sql: string; number: number };
};
