import { styled } from '@mui/material/styles';

export const QuickAddRuleExceptionContextSummaryStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  .context-summary-title {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  .context-summary-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .context-summary-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
    border-radius: 6px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    padding: 10px 12px;
  }

  .context-summary-item-label {
    flex-shrink: 0;
    min-width: 96px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }

  .context-summary-item-value {
    flex: 1;
    min-width: 0;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    line-height: 20px;
    word-break: break-all;

    .actiontech-sql-snippet-renderer-wrapper,
    .actiontech-sql-renderer-wrapper {
      width: 100%;

      .ant-typography {
        flex: 1;
        min-width: 0;
        margin-bottom: 0;
      }
    }

    .actiontech-sql-renderer-wrapper {
      display: block;

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: visible;
      }

      code {
        white-space: pre-wrap;
        word-break: break-all;
      }

      .code-line {
        height: auto;
        min-height: 26px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  .context-summary-sql-toggle {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    line-height: 20px;
  }

  .context-summary-item-value.is-missing {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
  }

  .context-summary-item-rule-scope {
    flex-direction: column;
    gap: 8px;
    border: none;
    background-color: transparent;
    padding: 0;
  }

  .context-summary-item-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }

  .context-summary-item-rule-scope .context-summary-item-value {
    width: 100%;
  }

  .context-summary-item-rule-scope .result-item {
    border-radius: 6px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    padding: 10px 12px;
  }
`;
