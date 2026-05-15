import { OnMount } from '@monaco-editor/react';
import { MonacoEditorContainerStyleWrapper } from './style';
import classNames from 'classnames';
import MonacoEditor from '@monaco-editor/react';
import { editorDefaultOptions } from './config';
import {
  CUSTOM_DIFF_EDITOR_THEME_NAME,
  editorDefaultThemeData,
  editorDarkThemeData,
  CUSTOM_DARK_EDITOR_THEME_NAME
} from './theme';
import { CustomMonacoEditorProps } from './MonacoEditor.types';
import useMonacoScrollbarHandler from './hooks/useMonacoScrollbarHandler';
import { SupportTheme } from '@actiontech/dms-kit';
import './monacoEditorConfig';

const CustomMonacoEditor: React.FC<CustomMonacoEditorProps> = ({
  options,
  className,
  theme,
  ...props
}) => {
  const { containerRef, setupScrollbarHandler } = useMonacoScrollbarHandler();

  const editorDidMount: OnMount = (editor, monaco) => {
    setupScrollbarHandler(editor, monaco);

    props.onMount?.(editor, monaco);
    if (theme === SupportTheme.DARK) {
      monaco.editor.defineTheme(
        CUSTOM_DARK_EDITOR_THEME_NAME,
        editorDarkThemeData
      );
      monaco.editor.setTheme(CUSTOM_DARK_EDITOR_THEME_NAME);
    } else {
      monaco.editor.defineTheme(
        CUSTOM_DIFF_EDITOR_THEME_NAME,
        editorDefaultThemeData
      );
      monaco.editor.setTheme(CUSTOM_DIFF_EDITOR_THEME_NAME);
    }
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
