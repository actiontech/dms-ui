import { styled } from '@mui/material/styles';

export const ModeSwitcherItemStyleWrapper = styled('div')<{ active?: boolean }>`
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

  .actiontech-mode-switcher-item-icon {
    display: inline-flex;
    align-items: center;
    width: 10%;
    color: ${({ theme, active }) =>
      active
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorTextQuaternary} !important;
  }

  .actiontech-mode-switcher-item-text {
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
