import { MonacoDiffEditor } from '../../MonacoEditor';
import { SQLDiffViewOnlyEditorRendererProps } from '../index.type';

const DiffViewOnlyEditor: React.FC<SQLDiffViewOnlyEditorRendererProps> = ({
  originalSql,
  modifiedSql,
  ...props
}) => {
  return (
    <MonacoDiffEditor
      className="actiontech-diff-sql-view-only-editor-renderer-wrapper"
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
