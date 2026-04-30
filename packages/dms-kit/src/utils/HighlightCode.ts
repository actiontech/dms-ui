import hljs from 'highlight.js/lib/core';
import sqlCore from 'highlight.js/lib/languages/sql';

// oxlint-disable-next-line import/no-unassigned-import
import 'highlight.js/styles/github.css';

class HighlightCode {
  constructor() {
    hljs.registerLanguage('sql', sqlCore);
  }

  public highlightSql(sql: string) {
    const code = hljs.highlight(sql, { language: 'sql' });
    return code.value;
  }
}

// oxlint-disable-next-line import/no-anonymous-default-export
export default new HighlightCode();
