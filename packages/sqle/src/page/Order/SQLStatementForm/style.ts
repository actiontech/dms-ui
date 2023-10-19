import { styled } from '@mui/material/styles';

export const UploadTypeStyleWrapper = styled('div')`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UploadItemTypeStyleWrapper = styled('div')<{ active?: boolean }>`
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillQuaternary};
  border: 1px solid
    ${({ theme, active }) =>
      active
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorBorderSecondary};
  border-radius: 4px;
  display: flex;
  height: 36px;
  padding: 10px 8px 10px 12px;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.4s ease;
  transition: color 0.4s ease;

  .custom-icon {
    display: inline-block;
    width: 10%;
    color: ${({ theme, active }) =>
      active
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorTextQuaternary};
  }

  .text {
    display: inline-block;
    width: 90%;
    text-align: center;
    color: ${({ theme, active }) =>
      active
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorText};
  }
`;
