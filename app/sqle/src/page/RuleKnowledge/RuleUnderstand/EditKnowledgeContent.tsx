import { EditKnowledgeContentProps } from './index.type';
import rehypeSanitize from 'rehype-sanitize';
import { RuleKnowledgeEditorStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import { markdownPreviewOptions } from '../Common/MarkdownPreview/markdownPreviewOptions';
import { commands, ICommand } from '@uiw/react-md-editor';
import { useMemo } from 'react';

const EditKnowledgeContent: React.FC<EditKnowledgeContentProps> = ({
  value,
  onChange,
  setHasDirtyData
}) => {
  const { t } = useTranslation();

  const customCommands: ICommand[] = useMemo(() => {
    return [
      {
        name: 'label',
        keyCommand: 'label',
        buttonProps: { 'aria-label': 'Insert help' },
        icon: <span>Label</span>,
        execute: (state, api) => {
          api.replaceSelection('```label []```');
        }
      },
      {
        name: 'Diff',
        keyCommand: 'Diff',
        buttonProps: { 'aria-label': 'Insert help' },
        icon: <span>Diff</span>,
        execute: (state, api) => {
          api.replaceSelection(`
\`\`\`sql_diff
    ---before
    ---after
\`\`\`
        `);
        }
      }
    ];
  }, []);

  return (
    <RuleKnowledgeEditorStyleWrapper
      height="500px"
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
        components: markdownPreviewOptions?.components
      }}
      value={value}
      onChange={(v) => {
        onChange?.(v);
        setHasDirtyData(true);
      }}
      textareaProps={{
        placeholder: t('ruleKnowledge.editorPlaceholder')
      }}
      commands={[...commands.getCommands(), ...customCommands]}
    />
  );
};

export default EditKnowledgeContent;
