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

export const WarningHighlightedSqlStyleWrapper = styled('pre')`
  margin: 0;
  padding: 8px 12px;
  background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorBorder};
  border-radius: 4px;
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: 20px;
  white-space: pre;
  overflow-x: auto;

  .code-line {
    display: block;
    min-height: 20px;
  }

  .warning-highlight-line {
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorWarningBgHover};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    border-left: 3px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorWarning};
    padding-left: 6px;
    font-weight: 500;
  }
`;
