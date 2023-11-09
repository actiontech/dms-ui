import { styled } from '@mui/material/styles';

export const UploadTypeStyleWrapper = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;

  .update-type-item-wrapper:not(:first-of-type) {
    margin-left: 12px;
  }
`;

export const UploadItemTypeSpaceOccupyingStyleWrapper = styled('div')`
  flex: 1 0 30%;
  margin-left: 12px;
`;

export const UploadItemTypeStyleWrapper = styled('div')<{ active?: boolean }>`
  flex: 1 0 30%;
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
  position: relative;
  overflow: hidden;

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

  .active-icon-wrapper {
    width: 0;
    height: 0;
    border: 11px solid ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    border-left-color: transparent;
    border-bottom-color: transparent;
    position: absolute;
    top: 0;
    right: 0;

    .active-icon {
      position: absolute;
      top: -11px;
      right: -11px;
    }
  }
`;
