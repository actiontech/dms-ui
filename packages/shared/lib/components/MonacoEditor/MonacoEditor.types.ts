import { DiffEditorProps, EditorProps } from '@monaco-editor/react';

export type MonacoDiffEditorProps = Omit<DiffEditorProps, 'theme'>;

export type CustomMonacoEditorProps = EditorProps;
