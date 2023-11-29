import { EditorProps } from '@monaco-editor/react';
import { MonacoEditorStyleWrapper } from './style';
import classNames from 'classnames';

import './monacoEditorConfig';

const CustomMonacoEditor: React.FC<Omit<EditorProps, 'theme'>> = ({
  options,
  className,
  ...props
}) => {
  return (
    <MonacoEditorStyleWrapper
      {...props}
      className={classNames(className, 'custom-monaco-editor')}
      options={{
        ...options,
        automaticLayout: true,
        minimap: { enabled: false },
        fontFamily: 'SF Mono',
        fontSize: 14,
        fontWeight: '400',
        lineNumbersMinChars: 2,
        suggestFontSize: 14
      }}
    />
  );
};
export default CustomMonacoEditor;
