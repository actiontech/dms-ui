import { styled } from '@mui/material/styles';

export const BasicInfoStyleWrapper = styled('div')`
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  padding: 24px 40px;

  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .id-text {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-bottom: 12px;
  }

  .tags-cont {
    display: flex;
    align-items: center;

    .custom-tag-item {
      display: flex;
      align-items: center;
      height: 28px;
      padding: 0 8px 0 6px;
      border-radius: 4px;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      margin-right: 8px;

      * {
        font-size: 13px;
        font-weight: 600;
        line-height: 20px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      }
    }
  }
`;
