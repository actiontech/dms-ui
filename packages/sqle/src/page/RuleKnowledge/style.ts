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

  .card-editing-status .w-md-editor {
    box-shadow: none;
  }

  .card-editing-status.antd-v5-card .antd-v5-card-body {
    padding: 0;
  }
`;

export const RuleKnowledgeEditorStyleWrapper = styled(MDEditor)`
  .code-line {
    font-family: inherit !important;

    .token {
      font-family: inherit !important;
    }
  }

  &.w-md-editor,
  & .w-md-editor-toolbar,
  & .wmde-markdown-color {
    background-color: inherit;
  }

  & .w-md-editor-toolbar {
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  & .w-md-editor-preview {
    box-shadow: inset 1px 0 0 0
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }
`;

export const RuleKnowledgeMarkDownStyleWrapper = styled(MDEditor.Markdown)`
  &.wmde-markdown {
    background-color: transparent;
  }
`;
