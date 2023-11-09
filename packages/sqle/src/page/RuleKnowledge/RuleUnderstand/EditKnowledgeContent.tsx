import { EditKnowledgeContentProps } from './index.type';
import rehypeSanitize from 'rehype-sanitize';
import { RuleKnowledgeEditorStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';

const EditKnowledgeContent: React.FC<EditKnowledgeContentProps> = ({
  value,
  onChange,
  setHasDirtyData
}) => {
  const { t } = useTranslation();

  return (
    <RuleKnowledgeEditorStyleWrapper
      height="500px"
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]]
      }}
      value={value}
      onChange={(v) => {
        onChange?.(v);
        setHasDirtyData(true);
      }}
      textareaProps={{
        placeholder: t('ruleKnowledge.editorPlaceholder')
      }}
    />
  );
};

export default EditKnowledgeContent;
