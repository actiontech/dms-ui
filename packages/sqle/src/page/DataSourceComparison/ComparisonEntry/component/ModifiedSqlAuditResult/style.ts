import { styled } from '@mui/material';
import { Card } from 'antd';

export const ModifiedSqlAuditResultInfoStyleWrapper = styled(Card)`
  .ant-card-body {
    padding: 24px 24px 4px !important;
  }
`;

export const ModifiedSqlAuditResultTitleStyleWrapper = styled('div')`
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-text {
    padding: 6px 12px;
    border-radius: 4px;
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgActive};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  }
`;
