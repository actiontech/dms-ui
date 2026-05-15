import MDEditor from '@uiw/react-md-editor';
import useCurrentUser from '../../features/useCurrentUser';
import { BasicMDEditorProps } from './BasicMDEditor.type';
import BasicMDEditorMarkdown from './BasicMDEditorMarkdown';

const BasicMDEditor = ({ customTheme, ...props }: BasicMDEditorProps) => {
  const { theme: currentTheme } = useCurrentUser();
  return (
    <div
      className="full-width-element"
      data-color-mode={customTheme || currentTheme}
    >
      <MDEditor {...props} />
    </div>
  );
};

BasicMDEditor.Markdown = BasicMDEditorMarkdown;

export default BasicMDEditor;
