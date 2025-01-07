import { DiffEditor, DiffOnMount } from '@monaco-editor/react';
import classNames from 'classnames';
import { editorDefaultOptions } from './config';
import { CUSTOM_DIFF_EDITOR_THEME_NAME, editorDefaultThemeData } from './theme';
import './monacoEditorConfig';
import { MonacoEditorContainerStyleWrapper } from './style';
import { MonacoDiffEditorProps } from './MonacoEditor.types';

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  options,
  className,
  ...props
}) => {
  const editorDidMount: DiffOnMount = (editor, monaco) => {
    props.onMount?.(editor, monaco);
    monaco.editor.defineTheme(
      CUSTOM_DIFF_EDITOR_THEME_NAME,
      editorDefaultThemeData
    );
    monaco.editor.setTheme(CUSTOM_DIFF_EDITOR_THEME_NAME);
  };
  return (
    <MonacoEditorContainerStyleWrapper
      className={classNames(className, 'custom-diff-monaco-editor')}
    >
      <DiffEditor
        {...props}
        onMount={editorDidMount}
        theme={CUSTOM_DIFF_EDITOR_THEME_NAME}
        options={{
          ...editorDefaultOptions,
          renderOverviewRuler: false,
          ...options
        }}
      />
    </MonacoEditorContainerStyleWrapper>
  );
};
export default MonacoDiffEditor;
