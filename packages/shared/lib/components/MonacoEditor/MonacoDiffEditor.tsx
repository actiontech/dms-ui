import { DiffEditor, DiffOnMount } from '@monaco-editor/react';
import classNames from 'classnames';
import { editorDefaultOptions } from './config';
import { CUSTOM_DIFF_EDITOR_THEME_NAME, editorDefaultThemeData } from './theme';
import React from 'react';
import './monacoEditorConfig';
import { MonacoEditorContainerStyleWrapper } from './style';
import { MonacoDiffEditorProps } from './MonacoEditor.types';
import useMonacoScrollbarHandler from './hooks/useMonacoScrollbarHandler';

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps> = ({
  options,
  className,
  ...props
}) => {
  const { containerRef, setupScrollbarHandler } = useMonacoScrollbarHandler<
    Parameters<DiffOnMount>[0],
    Parameters<DiffOnMount>[1]
  >();

  const editorDidMount: DiffOnMount = (editor, monaco) => {
    setupScrollbarHandler(editor, monaco, (diffEditor) => {
      const modifiedEditor = diffEditor.getModifiedEditor();

      return {
        getContentHeight: () => modifiedEditor.getContentHeight(),
        getContentWidth: () => modifiedEditor.getContentWidth(),
        getLayoutInfo: () => modifiedEditor.getLayoutInfo(),
        getScrollTop: () => modifiedEditor.getScrollTop(),
        getScrollLeft: () => modifiedEditor.getScrollLeft(),
        setScrollTop: (scrollTop: number) =>
          modifiedEditor.setScrollTop(scrollTop),
        setScrollLeft: (scrollLeft: number) =>
          modifiedEditor.setScrollLeft(scrollLeft),
        onDidChangeModelContent: (listener: () => void) =>
          modifiedEditor.onDidChangeModelContent(listener),
        onDidLayoutChange: (listener: () => void) =>
          modifiedEditor.onDidLayoutChange(listener)
      };
    });

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
