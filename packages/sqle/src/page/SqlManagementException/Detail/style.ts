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

  .detail-field-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 8px;
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

  .match-mode-item-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .match-mode-item-value {
    min-width: 0;
  }

  .rule-scope-list-item {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 13px;
    line-height: 20px;
  }
`;
