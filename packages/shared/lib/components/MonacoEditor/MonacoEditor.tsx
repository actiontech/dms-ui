import { OnMount } from '@monaco-editor/react';
import { MonacoEditorContainerStyleWrapper } from './style';
import classNames from 'classnames';
import MonacoEditor from '@monaco-editor/react';
import { editorDefaultOptions } from './config';
import { CUSTOM_DIFF_EDITOR_THEME_NAME, editorDefaultThemeData } from './theme';
import { CustomMonacoEditorProps } from './MonacoEditor.types';
import useMonacoScrollbarHandler from './hooks/useMonacoScrollbarHandler';
import './monacoEditorConfig';

const CustomMonacoEditor: React.FC<CustomMonacoEditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { containerRef, setupScrollbarHandler } = useMonacoScrollbarHandler();

  const editorDidMount: OnMount = (editor, monaco) => {
    setupScrollbarHandler(editor, monaco);

    props.onMount?.(editor, monaco);
    monaco.editor.defineTheme(
      CUSTOM_DIFF_EDITOR_THEME_NAME,
      editorDefaultThemeData
    );
    monaco.editor.setTheme(CUSTOM_DIFF_EDITOR_THEME_NAME);
  };

  return (
    <MonacoEditorContainerStyleWrapper
      className="custom-monaco-editor-wrapper"
      ref={containerRef}
    >
      <MonacoEditor
        {...props}
        className={classNames(className, 'custom-monaco-editor')}
        onMount={editorDidMount}
        options={{
          ...editorDefaultOptions,
          ...options
        }}
      />
    </MonacoEditorContainerStyleWrapper>
  );
};
export default CustomMonacoEditor;
