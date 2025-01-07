import classNames from 'classnames';
import { MonacoDiffEditor } from '../../MonacoEditor';
import { SQLDiffViewOnlyEditorRendererProps } from '../SQLRenderer.types';

const DiffViewOnlyEditor: React.FC<SQLDiffViewOnlyEditorRendererProps> = ({
  originalSql,
  modifiedSql,
  className,
  ...props
}) => {
  return (
    <MonacoDiffEditor
      className={classNames(
        'actiontech-diff-sql-view-only-editor-renderer-wrapper',
        className
      )}
      original={originalSql}
      modified={modifiedSql}
      {...props}
      language="sql"
      options={{
        ...props.options,
        readOnly: true
      }}
    />
  );
};

export default DiffViewOnlyEditor;
