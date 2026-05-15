import { styled } from '@mui/material/styles';
import { BasicMDEditor } from '@actiontech/shared';

export const RuleKnowledgeStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const RuleKnowledgeContentStyleWrapper = styled('div')`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .space-wrapper {
    width: 100%;
  }

  .card-editing-status .w-md-editor {
    box-shadow: none;
  }

  .card-editing-status.ant-card .ant-card-body {
    padding: 0;
  }

  .rule-knowledge-info-card.ant-card-bordered {
    border: 0;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .ant-card-body {
      padding: 24px 40px;
    }

    .ant-tag {
      display: inline-block;
    }

    .ant-typography {
      margin: 0;
    }
  }
`;

export const RuleKnowledgeEditorStyleWrapper = styled(BasicMDEditor)`
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

  &.w-md-editor-fullscreen {
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
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

export const RuleKnowledgeMarkDownStyleWrapper = styled(BasicMDEditor.Markdown)`
  &.wmde-markdown {
    background-color: transparent;
  }
`;

export const RuleKnowledgeDocumentStyleWrapper = styled('div')`
  display: flex;
  padding: 24px 40px;
  flex: 1;
  overflow: auto;

  &.card-editing-status .w-md-editor {
    box-shadow: none;
    width: 100% !important;
  }

  .ant-spin-nested-loading {
    height: 100%;
    width: 100%;

    .ant-spin-container {
      height: 100%;
      width: 100%;
      display: flex;
    }
  }

  .markdown-container {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 24px;
    padding-right: 12px;
    flex: 1;
  }

  .ant-empty-normal {
    margin: 32px auto !important;
  }

  .graph-title {
    margin-top: 16px;
  }
`;
