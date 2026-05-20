import { styled } from '@mui/material/styles';

export const WorkflowStatCardsWrapper = styled('div')`
  margin: 20px ${({ theme }) => theme.baseTheme.guidance.padding}px;
  margin-bottom: ${({ theme }) => theme.baseTheme.guidance.gap}px;

  .workflow-cards-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

    .ant-card-body {
      padding: 24px;
    }
  }

  .cards-content {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .cards-left-section {
    min-width: 160px;
    padding-right: 32px;
    border-right: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      margin-bottom: 6px;
    }

    .section-description {
      font-size: 13px;
      line-height: 20px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      margin-bottom: 14px;
    }

    .section-link {
      font-size: 13px;
      color: #1677ff;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: color 0.3s;

      &:hover {
        color: #4096ff;
      }
    }
  }

  .cards-row {
    flex: 1;
    display: flex;
    align-items: stretch;
  }
`;

export const WorkflowCardItemWrapper = styled('div')<{
  $accentColor: string;
}>`
  flex: 1;
  cursor: pointer;
  padding: 0 24px;
  border-left: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  transition: background 0.2s;
  border-radius: 6px;

  &:first-of-type {
    border-left: none;
    padding-left: 0;
  }

  &:last-of-type {
    padding-right: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary};

    .card-icon {
      color: ${({ $accentColor }) => $accentColor};
    }

    .card-count {
      color: ${({ $accentColor }) => $accentColor};
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;

    .card-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 16px;
      transition: color 0.2s;
    }

    .card-title {
      font-size: 14px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      white-space: nowrap;
    }
  }

  .card-count {
    font-size: 32px;
    font-weight: 600;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    line-height: 1;
    margin-bottom: 8px;
    transition: color 0.2s;
  }

  .card-subtitle {
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    white-space: nowrap;
  }
`;
