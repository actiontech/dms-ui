import {
  MonacoEditor,
  CustomMonacoEditorProps
} from '@actiontech/shared/lib/components/MonacoEditor';
import { Alert } from 'antd';
import { CustomMonacoEditorStyleWrapper } from './style';
import { EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

type MonacoEditorProps = CustomMonacoEditorProps & {
  showAlert?: boolean;
};

const CustomMonacoEditor: React.FC<MonacoEditorProps> = ({
  showAlert,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <CustomMonacoEditorStyleWrapper>
      <MonacoEditor
        {...props}
        onMount={(editor, monaco) => {
          props.onMount?.(editor, monaco);
          // 目前版本的monaco-editor不支持修改只读模式下的提示信息 所以暂时隐藏掉此提示信息
          editor
            .getContribution('editor.contrib.readOnlyMessageController')
            ?.dispose?.();
        }}
      />
      <EmptyBox if={showAlert}>
        <Alert
          message={t(
            'execWorkflow.create.form.sqlInfo.unsupportedSqlFormatAlert'
          )}
          type="warning"
          showIcon
        />
      </EmptyBox>
    </CustomMonacoEditorStyleWrapper>
  );
};

export default CustomMonacoEditor;
