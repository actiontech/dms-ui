import { styled } from '@mui/material/styles';

export const GlobalDashboardFilterStyleWrapper = styled('div')`
  & .ant-form.ant-form-horizontal {
    .ant-select-selector,
    .custom-search-input {
      font-size: 13px !important;
    }
  }

  & .custom-select-namespace {
    width: 280px;
  }
`;

export const SqlGovernancePanelStyleWrapper = styled('div')`
  .ant-tag {
    width: max-content;
  }

  .global-dashboard-sql-fingerprint-cell {
    .global-dashboard-sql-metrics {
      margin-top: 8px;
      font-size: 12px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }

    .sql-metrics-sep {
      margin: 0 4px;
    }
  }
`;

export const StatCardsStyleWrapper = styled('div')`
  display: flex;
  margin-bottom: 16px;
  padding: 20px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

  & > *:not(:last-child) {
    margin-right: 12px;
  }
`;

export const StatCardItemStyleWrapper = styled('div')<{
  $accentColor: string;
  $active: boolean;
}>`
  flex: 1;
  cursor: pointer;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, $active, $accentColor }) => {
      if ($active) {
        return $accentColor;
      }
      return theme.sharedTheme.uiToken.colorBorderSecondary;
    }};
  background: ${({ theme, $active }) =>
    $active
      ? theme.sharedTheme.uiToken.colorFillQuaternary
      : theme.sharedTheme.uiToken.colorBgBase};
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: ${({ $accentColor }) => $accentColor};
  }

  .stat-card-title {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    margin-bottom: 10px;
    white-space: nowrap;
  }

  .stat-card-count-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .stat-card-count-row .stat-card-icon {
    margin-right: 10px;
  }

  .stat-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: ${({ theme, $active, $accentColor }) =>
      $active ? $accentColor : theme.sharedTheme.uiToken.colorTextTertiary};
    line-height: 1;
  }

  .stat-card-count {
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme, $active, $accentColor }) =>
      $active ? $accentColor : theme.sharedTheme.uiToken.colorText};
    line-height: 1;
  }

  .stat-card-subtitle {
    font-size: 12px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    white-space: nowrap;
  }
`;
