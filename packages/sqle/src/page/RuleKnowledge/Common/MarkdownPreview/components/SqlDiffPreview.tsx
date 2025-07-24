import { SQLRenderer } from '@actiontech/shared';
import { SqlDiffPreviewStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';

interface SqlDiffPreviewProps {
  beforeSql: string;
  afterSql: string;
}

const SqlDiffPreview: React.FC<SqlDiffPreviewProps> = ({
  beforeSql,
  afterSql
}) => {
  const { t } = useTranslation();

  const calculateLines = (sql: string): number => {
    if (!sql) return 0;
    return sql.split('\n').length;
  };

  const beforeLines = calculateLines(beforeSql);
  const afterLines = calculateLines(afterSql);
  const maxLines = Math.max(beforeLines, afterLines);

  const LINE_HEIGHT = 24;
  const MIN_HEIGHT = 100;
  const MAX_HEIGHT = 600;
  const PADDING = 20;

  const calculatedHeight = Math.max(
    MIN_HEIGHT,
    Math.min(maxLines * LINE_HEIGHT + PADDING, MAX_HEIGHT)
  );

  return (
    <SqlDiffPreviewStyleWrapper>
      <div className="diff-header">
        <div>{t('ruleKnowledge.originalSql')}</div>
        <div>{t('ruleKnowledge.optimizedSql')}</div>
      </div>
      <SQLRenderer.DiffViewOnlyEditor
        originalSql={beforeSql}
        modifiedSql={afterSql}
        height={calculatedHeight}
      />
    </SqlDiffPreviewStyleWrapper>
  );
};

export default SqlDiffPreview;
