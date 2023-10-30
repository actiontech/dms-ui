import { styled } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';

export const RuleKnowledgeContentStyleWrapper = styled('div')`
  padding: 24px;

  .space-wrapper {
    width: 100%;
  }

  .next-icon-wrap {
    text-align: center;
    margin: 12px 0;
  }
`;

export const RuleKnowledgeEditorStyleWrapper = styled(MDEditor)`
  .code-line {
    font-family: inherit !important;

    .token {
      font-family: inherit !important;
    }
  }
`;

export const RuleKnowledgeMarkDownStyleWrapper = styled(MDEditor.Markdown)`
  &.wmde-markdown {
    background-color: transparent;
  }
`;
