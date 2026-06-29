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
    border-radius: 6px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    padding: 10px 12px;
  }

  .context-summary-item-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .context-summary-item-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    line-height: 20px;
    word-break: break-all;
  }

  .context-summary-item-value.is-missing {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
  }
`;
