import { useCallback } from 'react';
import { SQLRendererProps } from '../index.type';
import HighlightCode from '../../../utils/HighlightCode';

const useRenderSQLTemplate = (params: SQLRendererProps) => {
  const {
    showLineNumbers,
    sql,
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat
  } = params;
  const renderSQLTemplateContent = useCallback(() => {
    if (!sql) {
      return <span className="empty-sql-placeholder">{emptySqlContent}</span>;
    }

    const sqlContent = highlightSyntax ? HighlightCode.highlightSql(sql) : sql;

    let template = '';
    if (preserveOriginalFormat) {
      const lines = sqlContent.split(/\r?\n|\r/g);

      template = lines
        .map((w, i) => {
          if (showLineNumbers) {
            return `<div class="code-line"><span class="code-line-number">${
              i + 1
            }</span>${w}</div>`;
          }

          return `<div class="code-line">${w}</div>`;
        })
        .join('');
    } else {
      template = sqlContent;
    }

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: template
        }}
      />
    );
  }, [
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat,
    showLineNumbers,
    sql
  ]);

  return {
    renderSQLTemplateContent
  };
};

export default useRenderSQLTemplate;
