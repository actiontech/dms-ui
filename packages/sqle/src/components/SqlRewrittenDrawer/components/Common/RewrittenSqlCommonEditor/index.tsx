import { LazyLoadComponent } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
type Props = {
  showSqlDifference: boolean;
  originalSql: string;
  rewrittenSql: string;
};
const RewrittenSqlCommonEditor: React.FC<Props> = ({
  showSqlDifference,
  originalSql,
  rewrittenSql
}) => {
  return (
    <>
      <LazyLoadComponent open={showSqlDifference} animation={false}>
        <SQLRenderer.DiffViewOnlyEditor
          height={500}
          originalSql={originalSql}
          modifiedSql={rewrittenSql}
        />
      </LazyLoadComponent>
      <LazyLoadComponent open={!showSqlDifference} animation={false}>
        <SQLRenderer.ViewOnlyEditor height={500} sql={rewrittenSql} />
      </LazyLoadComponent>
    </>
  );
};
export default RewrittenSqlCommonEditor;
