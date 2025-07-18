import { EditorProps } from '@monaco-editor/react';

export const editorDefaultOptions: EditorProps['options'] = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontFamily: 'SF Mono',
  fontSize: 14,
  fontWeight: '400',
  lineNumbersMinChars: 2,
  suggestFontSize: 14,
  scrollBeyondLastLine: false,
  lineHeight: 24,
  letterSpacing: 0.8,
  overviewRulerBorder: false,
  wordWrap: 'on',
  wrappingStrategy: 'advanced',
  wrappingIndent: 'indent',
  // 滚动配置
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: false,
    verticalScrollbarSize: 12,
    horizontalScrollbarSize: 12,
    alwaysConsumeMouseWheel: false
  },

  folding: false,
  lineNumbers: 'on',
  glyphMargin: false,
  lineDecorationsWidth: 50,
  renderValidationDecorations: 'on',

  guides: {
    indentation: true,
    highlightActiveIndentation: true
  }
};
