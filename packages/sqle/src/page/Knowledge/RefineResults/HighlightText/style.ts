import { styled } from '@mui/material';

export const TextContainerStyleWrapper = styled('div')`
  display: inline;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;

  .normal-text {
    display: inline;
  }
`;

export const HighlightSpanStyleWrapper = styled('span')`
  display: inline;
  color: ${({ theme }) => theme.sqleTheme.knowledgeTheme.highlight.color};
  background: ${({ theme }) =>
    theme.sqleTheme.knowledgeTheme.highlight.background};
`;
