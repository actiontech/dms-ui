import * as monaco from 'monaco-editor';

// TODO theme
export const editorDefaultThemeData: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    // 基础代码样式
    { token: '', foreground: '71717a' },
    { token: 'keyword', foreground: 'd73a49', fontStyle: 'bold' },
    { token: 'string', foreground: 'dc2626' },
    { token: 'number', foreground: '16a34a' },
    { token: 'comment', foreground: '999988', fontStyle: 'italic' }
  ],
  colors: {
    // 编辑器背景色
    'editor.background': '#fcfbf9',
    'editor.foreground': '#333333',

    // 行号样式
    'editorLineNumber.foreground': '#999999',
    'editorLineNumber.activeForeground': '#333333',
    'editorGutter.background': '#f7f6f4',

    // 当前行高亮
    'editor.lineHighlightBackground': '#F8F9FA',
    'editor.lineHighlightBorder': '#00000000',

    // 差异对比颜色
    'diffEditor.insertedTextBackground': '#C8E6C9AA', // 浅绿色，添加的内容
    'diffEditor.removedTextBackground': '#FFCDD2AA', // 浅红色，删除的内容
    'diffEditor.insertedLineBackground': '#E8F5E9BB', // 整行添加的背景
    'diffEditor.removedLineBackground': '#FFEBEE99', // 整行删除的背景

    // 滚动条样式
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.background': '#E0E0E0',
    'scrollbarSlider.hoverBackground': '#BDBDBD',
    'scrollbarSlider.activeBackground': '#9E9E9E',

    'editorCursor.foreground': '#64748b', // 设置光标的颜色
    'editorCursor.background': '#FFFFFF00'
  }
};

export const CUSTOM_DIFF_EDITOR_THEME_NAME = 'editorCustomTheme';
