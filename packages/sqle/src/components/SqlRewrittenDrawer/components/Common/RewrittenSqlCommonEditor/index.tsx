import { LazyLoadComponent } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import { useCurrentUser } from '@actiontech/shared/lib/features';
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
  const { theme } = useCurrentUser();
  return (
    <>
      <LazyLoadComponent open={showSqlDifference} animation={false}>
        <SQLRenderer.DiffViewOnlyEditor
          theme={theme}
          height={500}
          originalSql={originalSql}
          modifiedSql={rewrittenSql}
        />
      </LazyLoadComponent>
      <LazyLoadComponent open={!showSqlDifference} animation={false}>
        <SQLRenderer.ViewOnlyEditor
          theme={theme}
          height={500}
          sql={rewrittenSql}
        />
      </LazyLoadComponent>
    </>
  );
};
export default RewrittenSqlCommonEditor;
