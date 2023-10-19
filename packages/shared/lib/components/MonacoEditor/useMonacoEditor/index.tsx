import { FormInstance } from 'antd';
import React from 'react';
import { IDisposable } from 'monaco-editor';
import { createDependencyProposals } from './index.data';
import { IRange } from './index.type';
import { NamePath } from 'antd/es/form/interface';
import { OnMount } from '@monaco-editor/react';
import { regexLanguage, regexMonarch } from './regexLanguage';

const useMonacoEditor = (
  form?: FormInstance,
  {
    formName,
    placeholder = '/* input your sql */'
  }: { formName?: NamePath; placeholder?: string } = {}
) => {
  const monacoProviderRef = React.useRef<IDisposable>();
  const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);

  const editorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoProviderRef.current = monaco.languages.registerCompletionItemProvider(
      'sql',
      {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range: IRange = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          return {
            suggestions: createDependencyProposals(monaco, range)
          };
        }
      }
    );

    editor.onDidFocusEditorText(() => {
      if (!!form && !!formName) {
        const currentValue = form.getFieldValue(formName);
        if (currentValue === placeholder) {
          form.setFields([{ name: formName, value: '' }]);
        }
      } else {
        const currentValue = editor.getValue();
        if (currentValue === placeholder) {
          editor.setValue('');
        }
      }
    });

    editor.onDidBlurEditorText(() => {
      if (!!form && !!formName) {
        const currentValue = form.getFieldValue(formName);
        if (currentValue === '') {
          form.setFields([{ name: formName, value: placeholder }]);
        }
      } else {
        const currentValue = editor.getValue();
        if (currentValue === '') {
          editor.setValue(placeholder);
        }
      }
    });
  };

  const registerRegexLanguage: OnMount = (_, monaco) => {
    monaco.languages.register(regexLanguage);
    monaco.languages.setMonarchTokensProvider('regexp', regexMonarch);
  };

  React.useEffect(() => {
    return () => {
      monacoProviderRef.current?.dispose();
    };
  }, []);

  return {
    editorDidMount,
    registerRegexLanguage
  };
};

export default useMonacoEditor;
