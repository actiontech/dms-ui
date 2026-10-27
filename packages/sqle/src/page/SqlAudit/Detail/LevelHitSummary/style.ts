import { styled } from '@mui/material/styles';

export const LevelHitSummaryStyleWrapper = styled('div')`
  padding: 16px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  &.is-cards {
    padding: 0;
    border-bottom: none;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-bottom: 12px;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    font-size: 14px;
    font-weight: 550;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};

    .section-hint {
      font-size: 12px;
      font-weight: 400;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }
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

  .level-overview {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    padding: 14px;
  }

  .level-stat {
    padding: 12px 14px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorBorder};
    border-radius: 5px;

    &.error {
      background: #ffece8;
      border-color: #ffccc7;
    }

    &.warn {
      background: #fff7e8;
      border-color: #ffe4ba;
    }

    &.notice {
      background: #fff8df;
      border-color: #ffe7a3;
    }

    &.normal {
      background: #e8ffea;
      border-color: #b7ebc6;
    }
  }

  .level-stat-value {
    font-size: 24px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    line-height: 32px;
  }

  .level-stat.error .level-stat-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  }

  .level-stat.warn .level-stat-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
  }

  .level-stat.notice .level-stat-value {
    color: #c98b00;
  }

  .level-stat.normal .level-stat-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
  }

  .level-stat-label {
    margin-top: 2px;
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }

  .priority-split {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 7px;

    span {
      padding: 1px 7px;
      border-radius: 3px;
      background: rgba(255, 255, 255, 0.72);
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      font-size: 11px;
    }
  }

  .level-hit-empty,
  .level-hit-error-msg {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    padding: 14px 16px;
  }
`;
