import { styled } from '@mui/material/styles';

export const SqlManagementExceptionDetailStyleWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DetailMetaInfoCardStyleWrapper = styled('section')`
  display: flex;
  flex-direction: row;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  padding: 16px 20px;

  .detail-meta-item {
    flex: 1;
    min-width: 0;
  }

  .detail-meta-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .detail-meta-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    word-break: break-all;
  }
`;

export const DetailFieldCardStyleWrapper = styled('section')`
  border-radius: 8px;
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
  padding: 16px 20px;

  .detail-field-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .detail-field-header:only-child {
    margin-bottom: 0;
  }

  .detail-field-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  .detail-field-value {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    word-break: break-all;
  }

  .detail-internal-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .detail-internal-list-item {
    border-radius: 6px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    padding: 10px 12px;
  }

  .detail-internal-list-item.match-mode-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px;
  }

  .match-mode-item-label {
    flex-shrink: 0;
    min-width: 72px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }

  .match-mode-item-value {
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

  .match-mode-sql-toggle {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    line-height: 20px;
  }

  .rule-scope-result-list {
    .result-item {
      border-radius: 6px;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      padding: 10px 12px;
    }
  }
`;
