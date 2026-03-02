import SqlRewrittenDrawer from 'sqle/src/components/SqlRewrittenDrawer';
import { IRewriteSQLData } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  sqlRewrittenExampleOriginalSql,
  sqlRewrittenExampleResult
} from './data';

interface SqlRewrittenExampleDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SqlRewrittenExampleDrawer: React.FC<SqlRewrittenExampleDrawerProps> = ({
  open,
  onClose
}) => {
  return (
    <SqlRewrittenDrawer
      open={open}
      onClose={onClose}
      taskID="mock-sql-rewritten-example"
      originSqlInfo={{
        sql: sqlRewrittenExampleOriginalSql,
        number: 1
      }}
      mockData={sqlRewrittenExampleResult as IRewriteSQLData}
    />
  );
};

export default SqlRewrittenExampleDrawer;
