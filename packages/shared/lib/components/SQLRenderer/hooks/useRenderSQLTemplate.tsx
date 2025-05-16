import { useCallback } from 'react';
import { SQLRendererProps } from '../SQLRenderer.types';
import HighlightCode from '../../../utils/HighlightCode';

const useRenderSQLTemplate = (
  params: Pick<
    SQLRendererProps,
    | 'sql'
    | 'showLineNumbers'
    | 'emptySqlContent'
    | 'highlightSyntax'
    | 'preserveOriginalFormat'
    | 'wordWrap'
  >
) => {
  const {
    showLineNumbers,
    sql,
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat,
    wordWrap
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
          let wrapClass = '';
          if (wordWrap) {
            wrapClass = showLineNumbers
              ? ' wrapped-line with-line-number'
              : ' wrapped-line';
          }

          if (showLineNumbers) {
            return `<div class="code-line${wrapClass}"><span class="code-line-number">${
              i + 1
            }</span>${w}</div>`;
          }

          return `<div class="code-line${wrapClass}">${w}</div>`;
        })
        .join('');
    } else {
      template = sqlContent;
    }

    return (
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: template
          }}
        />
      </pre>
    );
  }, [
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat,
    showLineNumbers,
    sql,
    wordWrap
  ]);

  return {
    renderSQLTemplateContent
  };
};

export default useRenderSQLTemplate;
