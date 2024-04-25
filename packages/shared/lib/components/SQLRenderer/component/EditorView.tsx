import { MonacoEditor } from '../../MonacoEditor';
import { SQLEditorViewRendererProps } from '../index.type';

const EditorView: React.FC<SQLEditorViewRendererProps> = ({
  sql,
  ...props
}) => {
  return (
    <MonacoEditor
      className="actiontech-sql-editor-view-renderer-wrapper"
      value={sql ?? ''}
      {...props}
      language="sql"
      options={{
        readOnly: true
      }}
    />
  );
};

export default EditorView;
