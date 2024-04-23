import { styled } from '@mui/material/styles';

export const ModeSwitcherItemStyleWrapper = styled('div')`
  &.actiontech-mode-switcher-item {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillQuaternary};
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
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
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorTextQuaternary} !important;
    }

    .actiontech-mode-switcher-item-text {
      display: inline-block;
      width: 90%;
      text-align: center;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    }
  }
  &.actiontech-mode-switcher-item-active {
    border: 1px solid ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};

    .actiontech-mode-switcher-item-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    .actiontech-mode-switcher-item-icon {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
    }

    .active-icon-wrapper {
      width: 0;
      height: 0;
      border: 11px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
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
  }
  &.actiontech-mode-switcher-item-disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    .actiontech-mode-switcher-item-icon {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorTextTertiary} !important;
    }

    .actiontech-mode-switcher-item-text {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
    }
  }
`;
