import { styled } from '@mui/material/styles';
import { Button } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicButtonStyleWrapper = styled(Button)`
  /* size */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn,
    &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-lg,
    &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    font-size: 13px;
    font-weight: 500;
    border-radius: ${({ theme }) =>
      theme.sharedTheme.basic.borderRadius4 + 'px'};
  }

  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-lg {
    padding: 0 16px;
  }

  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-sm {
    padding: 0 8px;
  }

  &.basic-button-wrapper:not(.${ANTD_PREFIX_STR}-btn-icon-only)
    > .${ANTD_PREFIX_STR}-btn-icon:not(:last-child) {
    margin-inline-end: 5px;
  }

  /* default */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn {
    padding: 0 12px;
    background: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default.background};
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default.color};
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default.boxShadow};

    &:hover {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.hover.background};
    }

    &:active {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.active.background};
    }

    &:disabled {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.disabled.background};
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.disabled.color};
    }
  }

  /* primary */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-primary {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default.color};
    background: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default.background};
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default.boxShadow};

    &:hover {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.hover.background};
    }

    &:active {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.active.background};
    }

    &:disabled {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.disabled.background};
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.disabled.color};
    }
  }

  /* dashed */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-dashed:not(:disabled):not(
      .${ANTD_PREFIX_STR}-btn-disabled
    ) {
    background: none;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dashed.default.border};

    &:hover {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.default.color};
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.hover.background};
    }

    &:active {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.default.color};
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.active.background};
    }
  }

  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-dashed:disabled {
    background: none;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dashed.default.border};
  }

  /* dangerous */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-dangerous {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dangerous.default.color};

    &:disabled {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.dangerous.disabled.color};
    }
  }

  /* btn-icon-no-border */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-default.btn-icon-no-border {
    background: none;
    box-shadow: none;

    &:disabled {
      background: none;
    }

    &:not(:disabled) {
      &:hover {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicButton.default.default.color};
        background: ${({ theme }) =>
          theme.sharedTheme.components.basicButton.default.hover.background};
      }

      &:active {
        color: ${({ theme }) =>
          theme.sharedTheme.components.basicButton.default.default.color};
        background: ${({ theme }) =>
          theme.sharedTheme.components.basicButton.default.active.background};
      }
    }
  }

  /* switch button */
  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-default.switch-btn-default {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
  }

  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-default.switch-btn-active {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgActive};
  }

  &.basic-button-wrapper.${ANTD_PREFIX_STR}-btn-default.has-icon-primary {
    .custom-icon {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
    }
  }
`;
