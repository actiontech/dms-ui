import { DiffEditorProps } from '@monaco-editor/react';
import classNames from 'classnames';
import { MonacoDiffEditorStyleWrapper } from './style';
import './monacoEditorConfig';

const MonacoDiffEditor: React.FC<Omit<DiffEditorProps, 'theme'>> = ({
  options,
  className,
  ...props
}) => {
  return (
    <MonacoDiffEditorStyleWrapper
      {...props}
      className={classNames(className, 'custom-diff-monaco-editor')}
      options={{
        ...options,
        automaticLayout: true,
        minimap: { enabled: false },
        fontFamily: 'SF Mono',
        fontSize: 14,
        fontWeight: '400',
        lineNumbersMinChars: 2,
        suggestFontSize: 14,
        scrollBeyondLastLine: false
      }}
    />
  );
};
export default MonacoDiffEditor;
