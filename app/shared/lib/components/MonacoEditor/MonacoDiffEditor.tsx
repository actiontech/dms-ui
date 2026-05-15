import { DiffEditor, DiffOnMount } from '@monaco-editor/react';
import classNames from 'classnames';
import { editorDefaultOptions } from './config';
import { CUSTOM_DIFF_EDITOR_THEME_NAME, editorDefaultThemeData } from './theme';
import { MonacoEditorContainerStyleWrapper } from './style';
import { MonacoDiffEditorProps } from './MonacoEditor.types';
import useMonacoScrollbarHandler from './hooks/useMonacoScrollbarHandler';
import './monacoEditorConfig';

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { containerRef, setupScrollbarHandler } = useMonacoScrollbarHandler();

  const editorDidMount: DiffOnMount = (editor, monaco) => {
    setupScrollbarHandler(editor.getModifiedEditor(), monaco);

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
      ref={containerRef}
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
