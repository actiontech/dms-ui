import { MonacoEditor } from '../../MonacoEditor';
import { SQLViewOnlyEditorRendererProps } from '../index.type';

const ViewOnlyEditor: React.FC<SQLViewOnlyEditorRendererProps> = ({
  sql,
  ...props
}) => {
  return (
    <MonacoEditor
      className="actiontech-sql-view-only-editor-renderer-wrapper"
      value={sql ?? ''}
      {...props}
      language="sql"
      options={{
        ...props.options,
        readOnly: true
      }}
    />
  );
};

export default ViewOnlyEditor;
