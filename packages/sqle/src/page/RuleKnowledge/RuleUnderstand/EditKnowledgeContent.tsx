import { EditKnowledgeContentProps } from './index.type';
import rehypeSanitize from 'rehype-sanitize';
import { RuleKnowledgeEditorStyleWrapper } from '../style';

const EditKnowledgeContent: React.FC<EditKnowledgeContentProps> = ({
  value,
  onChange,
  setHasDirtyData
}) => {
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
    />
  );
};

export default EditKnowledgeContent;
