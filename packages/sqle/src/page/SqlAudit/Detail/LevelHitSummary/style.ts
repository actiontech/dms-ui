import { styled } from '@mui/material/styles';

export const LevelHitSummaryStyleWrapper = styled('div')`
  padding: 16px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  .section-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-bottom: 12px;
  }

  .level-hit-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }

  .level-hit-item {
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

    .level-hit-value {
      font-weight: 600;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      margin-left: 4px;
    }

    .level-hit-sub {
      margin-left: 6px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    }
  }

  .level-hit-error {
    display: inline-flex;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .level-hit-empty,
  .level-hit-error-msg {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }
`;
