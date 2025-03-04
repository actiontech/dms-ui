import { getCodeString } from 'rehype-rewrite';
import { isArray } from 'lodash';
import LabelPreview from './components/LabelPreview';
import SqlDiffPreview from './components/SqlDiffPreview';
import SqlPreview from './components/SqlPreview';
import { MDEditorProps } from '@uiw/react-md-editor';

export const markdownPreviewOptions: MDEditorProps['previewOptions'] = {
  components: {
    code: ({ children, className, ...props }) => {
      /**
     * label 代码块
     * Example:
        ```label [label1, label2]```
     */
      const tagRegex = /label\s*\[([\s\S]*?)\]/;
      let match: string[] | null = null;
      if (children?.[0] && typeof children?.[0] === 'string') {
        match = children?.[0]?.match?.(tagRegex);
      }
      if (isArray(match) && !!match[1]) {
        return <LabelPreview source={match[1]} />;
      }

      const code =
        props.node && props.node.children
          ? getCodeString(props.node.children)
          : children;

      /**
     * sql_diff 代码块
     * Example:
        ```sql_diff
          ---before
            SELECT * FROM Users
            WHERE id > 0 
            AND status = 'active'
          ---after
            SELECT id, name 
            FROM Users
            WHERE id > 0 
            AND status = 'active'
        ```
     */
      if (
        typeof code === 'string' &&
        typeof className === 'string' &&
        /^language-sql_diff/.test(className.toLocaleLowerCase())
      ) {
        const beforeRegex = /---before\s*([\s\S]*?)(?=---after|$)/;
        const afterRegex = /---after\s*([\s\S]*?)(?=$)/;

        const beforeMatch = code.match(beforeRegex);
        const afterMatch = code.match(afterRegex);

        const matches = {
          before: beforeMatch ? beforeMatch[1].trim() : '',
          after: afterMatch ? afterMatch[1].trim() : ''
        };
        return (
          <SqlDiffPreview beforeSql={matches.before} afterSql={matches.after} />
        );
      }

      /**
     * sql 代码块
     * Example:
        ```sql
          SELECT * FROM Users
          WHERE id > 0 
          AND status = 'active'
        ```
     */
      if (
        typeof code === 'string' &&
        typeof className === 'string' &&
        /^language-sql/.test(className.toLocaleLowerCase())
      ) {
        return <SqlPreview code={code} />;
      }

      return <code className={String(className)}>{children}</code>;
    }
  }
};
