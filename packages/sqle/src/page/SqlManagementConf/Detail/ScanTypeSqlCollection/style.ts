import { styled } from '@mui/material/styles';

export const ScanTypeSqlCollectionStyleWrapper = styled('section')`
  .remediation-overview-card {
    margin-bottom: 16px;
  }

  .remediation-overview-metrics {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }

  .remediation-overview-metric {
    min-width: 160px;
    margin: 8px;
    padding-right: 24px;

    strong {
      display: block;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
    }

    span {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 13px;
    }
  }

  .remediation-overview-status-list {
    display: flex;
    flex-wrap: wrap;
    margin: 8px -8px -8px;
    padding-top: 12px;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .remediation-overview-status {
    display: flex;
    align-items: center;
    margin: 8px;

    strong {
      margin-left: 8px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-size: 16px;
      font-weight: 600;
    }
  }

  .remediation-overview-error {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
  }

  .table-describe-column {
    max-width: 600px;
  }

  .actiontech-table-filter-container-namespace {
    padding: 0;
    border: none;
  }

  .actiontech-table-toolbar-namespace {
    & > .ant-space-item:first-of-type {
      flex: 1;
    }
  }
`;
