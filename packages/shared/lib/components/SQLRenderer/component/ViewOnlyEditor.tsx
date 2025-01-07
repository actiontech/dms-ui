import classNames from 'classnames';
import { MonacoEditor } from '../../MonacoEditor';
import { SQLViewOnlyEditorRendererProps } from '../SQLRenderer.types';

const ViewOnlyEditor: React.FC<SQLViewOnlyEditorRendererProps> = ({
  sql,
  className,
  ...props
}) => {
  return (
    <MonacoEditor
      className={classNames(
        'actiontech-sql-view-only-editor-renderer-wrapper',
        className
      )}
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
