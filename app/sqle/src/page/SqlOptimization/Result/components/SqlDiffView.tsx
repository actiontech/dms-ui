import { SQLRenderer } from '@actiontech/shared';
import { SqlDiffStyleWrapper } from './style';
import CopyButton from './CopyButton';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface SqlDiffViewProps {
  originalSql: string;
  originTitle?: React.ReactNode;
  optimizedSql: string;
  optimizedTitle?: React.ReactNode;
}

const SqlDiffView: React.FC<SqlDiffViewProps> = ({
  originalSql,
  optimizedSql,
  originTitle,
  optimizedTitle
}) => {
  const { t } = useTranslation();
  const calculateLines = (sql: string): number => {
    if (!sql) return 0;
    return sql.split('\n').length;
  };

  const originalLines = calculateLines(originalSql);
  const optimizedLines = calculateLines(optimizedSql);
  const maxLines = Math.max(originalLines, optimizedLines);

  const LINE_HEIGHT = 24;
  const MIN_HEIGHT = 200;
  const MAX_HEIGHT = 600;
  const PADDING = 40;

  const calculatedHeight = Math.max(
    MIN_HEIGHT,
    Math.min(maxLines * LINE_HEIGHT + PADDING, MAX_HEIGHT)
  );

  return (
    <SqlDiffStyleWrapper>
      <div className="diff-header">
        <div className="diff-label original">
          {originTitle || t('sqlOptimization.result.beforeOptimization')}
          <CopyButton content={originalSql} onlyIcon />
        </div>
        <div className="diff-label optimized">
          {optimizedTitle || t('sqlOptimization.result.afterOptimization')}
          <CopyButton content={optimizedSql} onlyIcon />
        </div>
      </div>

      <div className="diff-content">
        <SQLRenderer.DiffViewOnlyEditor
          originalSql={originalSql}
          modifiedSql={optimizedSql}
          height={calculatedHeight}
        />
      </div>
    </SqlDiffStyleWrapper>
  );
};

export default SqlDiffView;
