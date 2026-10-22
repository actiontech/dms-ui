import { styled } from '@mui/material/styles';

export const RuleHitDetailsStyleWrapper = styled('div')`
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

  .rule-hit-table {
    width: 100%;

    .ant-table-cell {
      padding: 8px 12px;
      text-align: left;
      font-size: 13px;
      line-height: 20px;
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    }

    .ant-table-thead > tr > th {
      font-weight: 600;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    }

    .ant-table-tbody > tr > td {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      font-weight: 500;
    }

    .rule-hit-ellipsis-column {
      overflow: hidden;
    }
  }

  .rule-hit-empty,
  .rule-hit-error-msg {
    font-size: 13px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  }
`;
