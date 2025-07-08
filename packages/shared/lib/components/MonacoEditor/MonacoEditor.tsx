import { OnMount } from '@monaco-editor/react';
import { MonacoEditorContainerStyleWrapper } from './style';
import classNames from 'classnames';
import MonacoEditor from '@monaco-editor/react';
import { editorDefaultOptions } from './config';
import { CUSTOM_DIFF_EDITOR_THEME_NAME, editorDefaultThemeData } from './theme';
import React from 'react';

import './monacoEditorConfig';
import { CustomMonacoEditorProps } from './MonacoEditor.types';
import useMonacoScrollbarHandler from './hooks/useMonacoScrollbarHandler';

const CustomMonacoEditor: React.FC<CustomMonacoEditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { containerRef, setupScrollbarHandler } = useMonacoScrollbarHandler<
    Parameters<OnMount>[0],
    Parameters<OnMount>[1]
  >();

  const editorDidMount: OnMount = (editor, monaco) => {
    setupScrollbarHandler(editor, monaco, (editorInstance) => ({
      getContentHeight: () => editorInstance.getContentHeight(),
      getContentWidth: () => editorInstance.getContentWidth(),
      getLayoutInfo: () => editorInstance.getLayoutInfo(),
      getScrollTop: () => editorInstance.getScrollTop(),
      getScrollLeft: () => editorInstance.getScrollLeft(),
      setScrollTop: (scrollTop: number) =>
        editorInstance.setScrollTop(scrollTop),
      setScrollLeft: (scrollLeft: number) =>
        editorInstance.setScrollLeft(scrollLeft),
      onDidChangeModelContent: (listener: () => void) =>
        editorInstance.onDidChangeModelContent(listener),
      onDidLayoutChange: (listener: () => void) =>
        editorInstance.onDidLayoutChange(listener)
    }));

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
