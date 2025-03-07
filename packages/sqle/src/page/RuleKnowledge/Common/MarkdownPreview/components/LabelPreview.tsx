import { LabelPreviewStyleWrapper } from './style';

interface LabelPreviewProps {
  source: string;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ source }) => {
  return (
    <>
      {source?.split(',').map((i, index) => {
        return (
          <LabelPreviewStyleWrapper
            key={index}
            className="tag"
            color="geekblue"
            size="small"
          >
            {i}
          </LabelPreviewStyleWrapper>
        );
      })}
    </>
  );
};

export default LabelPreview;
