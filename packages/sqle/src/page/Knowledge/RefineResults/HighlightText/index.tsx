import { useMemo } from 'react';
import { IHighlightTextProps } from './index.type';
import { HighlightSpanStyleWrapper, TextContainerStyleWrapper } from './style';

const HighlightText: React.FC<IHighlightTextProps> = ({ text, keyword }) => {
  const highlightedText = useMemo(() => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword?.toLowerCase() ? (
        <HighlightSpanStyleWrapper key={index} className="highlight-text">
          {part}
        </HighlightSpanStyleWrapper>
      ) : (
        <span key={index} className="normal-text">
          {part}
        </span>
      )
    );
  }, [text, keyword]);

  return (
    <TextContainerStyleWrapper>{highlightedText}</TextContainerStyleWrapper>
  );
};

export default HighlightText;
