import { styled } from '@mui/material/styles';
import MonacoEditor, { DiffEditor } from '@monaco-editor/react';

export const MonacoEditorStyleWrapper = styled(MonacoEditor)`
  .monaco-editor {
    border: ${({ theme }) =>
      theme.sharedTheme.components.customMonacoEditor.border};
    border-radius: 8px;
    background: ${({ theme }) =>
      theme.sharedTheme.components.customMonacoEditor
        .linesContentBackgroundColor};

    .margin {
      background: ${({ theme }) =>
        theme.sharedTheme.components.customMonacoEditor.marginBackgroundColor};
      border-radius: 8px 0 0 8px;

      .margin-view-overlays {
        div {
          color: ${({ theme }) =>
            theme.sharedTheme.components.customMonacoEditor
              .marginViewOverlaysColor};
          left: 8px;
        }
      }
    }

    div.monaco-scrollable-element[role='presentation'] {
      height: calc(100% - 2px) !important;
      width: calc(100% - 50px) !important;

      .lines-content {
        background: ${({ theme }) =>
          theme.sharedTheme.components.customMonacoEditor
            .linesContentBackgroundColor};
      }

      .decorationsOverviewRuler {
        display: none !important;
      }
    }
  }
`;

export const MonacoDiffEditorStyleWrapper = styled(DiffEditor)`
  .monaco-diff-editor {
    border: ${({ theme }) =>
      theme.sharedTheme.components.customMonacoEditor.border};
    border-radius: 8px;
    background: ${({ theme }) =>
      theme.sharedTheme.components.customMonacoEditor
        .linesContentBackgroundColor};

    .margin {
      background: ${({ theme }) =>
        theme.sharedTheme.components.customMonacoEditor.marginBackgroundColor};
      border-radius: 8px 0 0 8px;

      .margin-view-overlays {
        div {
          color: ${({ theme }) =>
            theme.sharedTheme.components.customMonacoEditor
              .marginViewOverlaysColor};
          left: 8px;
        }
      }
    }

    div.monaco-scrollable-element[role='presentation'] {
      .lines-content {
        background: ${({ theme }) =>
          theme.sharedTheme.components.customMonacoEditor
            .linesContentBackgroundColor};
      }

      .decorationsOverviewRuler {
        display: none !important;
      }
    }

    .diffOverview {
      opacity: 0;
      transition: opacity 0.3s ease;
      width: 8px !important;
    }

    .diffOverview .diff-review-line {
      border-radius: 4px !important;
      transition: background 0.3s ease;
    }

    .diffOverview .diff-added,
    .diffOverview .diff-removed {
      opacity: 0.8;
      border-radius: 2px;
    }
  }
`;
