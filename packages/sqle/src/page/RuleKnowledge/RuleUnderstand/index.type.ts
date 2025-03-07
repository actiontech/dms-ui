import { MDEditorProps } from '@uiw/react-md-editor';

export type RuleUnderstandProps = {
  content?: string;
  loading: boolean;
  isModifying: boolean;
  editValue: MDEditorProps['value'];
  setEditValue: (val: MDEditorProps['value']) => void;
  setHasDirtyData: (val: boolean) => void;
  ruleName: string;
};

export type EditKnowledgeContentProps = {
  value: MDEditorProps['value'];
  onChange: MDEditorProps['onChange'];
  setHasDirtyData: (val: boolean) => void;
};
