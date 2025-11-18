import MDEditor from '@uiw/react-md-editor';
import useCurrentUser from '../../features/useCurrentUser';
import { BasicMDEditorMarkdownProps } from './BasicMDEditor.type';

const BasicMDEditorMarkdown: React.FC<BasicMDEditorMarkdownProps> = ({
  customTheme,
  ...props
}) => {
  const { theme: currentTheme } = useCurrentUser();
  return (
    <div
      className="full-width-element"
      data-color-mode={customTheme || currentTheme}
    >
      <MDEditor.Markdown {...props} />
    </div>
  );
};

export default BasicMDEditorMarkdown;
