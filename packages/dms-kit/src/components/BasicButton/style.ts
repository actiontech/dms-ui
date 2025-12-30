import { styled } from '@mui/material/styles';
import { Button } from 'antd';

export const BasicButtonStyleWrapper = styled(Button)`
  /* size */
  &.basic-button-wrapper.ant-btn,
  &.basic-button-wrapper.ant-btn-lg,
  &.basic-button-wrapper.ant-btn-sm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    font-size: 13px;
    font-weight: 500;
    border-radius: ${({ theme }) =>
      theme.sharedTheme.basic.borderRadius4 + 'px'};
  }

  &.basic-button-wrapper.ant-btn-lg {
    padding: 0 16px;
  }

  &.basic-button-wrapper.ant-btn-sm {
    padding: 0 8px;
  }

  &.basic-button-wrapper:not(.ant-btn-icon-only)
    > .ant-btn-icon:not(:last-child) {
    margin-inline-end: 5px;
  }

  &.basic-button-wrapper.ant-btn.ant-btn-text,
  &.basic-button-wrapper.ant-btn.ant-btn-link {
    background: none;
    box-shadow: none;

    &:disabled {
      background: none;
    }
  }

  &.basic-button-wrapper.ant-btn.ant-btn-link {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.link.default.color} !important;

    &:hover:not(:disabled) {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.link.hover.color} !important;
      background: none !important;
    }
  }

  /* default */
  &.basic-button-wrapper.ant-btn {
    padding: 0 12px;
    background: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default
        .background} !important;
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default
        .color} !important;
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.default.default
        .boxShadow} !important;
    border-color: transparent !important;

    &:hover:not(:disabled) {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.hover
          .background} !important;
      border-color: transparent !important;
    }

    &:active:not(:disabled) {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.active
          .background} !important;
      border-color: transparent !important;
    }

    &:disabled,
    &.ant-btn-disabled {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.disabled
          .background} !important;
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.disabled
          .color} !important;
      border-color: transparent !important;
      opacity: 1 !important;
    }
  }

  /* primary */
  &.basic-button-wrapper.ant-btn-primary {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default
        .color} !important;
    background: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default
        .background} !important;
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.primary.default
        .boxShadow} !important;
    border-color: transparent !important;

    &:hover:not(:disabled) {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.hover
          .background} !important;
      border-color: transparent !important;
    }

    &:active:not(:disabled) {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.active
          .background} !important;
      border-color: transparent !important;
    }

    &:disabled,
    &.ant-btn-disabled {
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.disabled
          .background} !important;
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.primary.disabled
          .color} !important;
      border-color: transparent !important;
      opacity: 1 !important;
    }
  }

  /* dashed */
  &.basic-button-wrapper.ant-btn-dashed:not(:disabled):not(.ant-btn-disabled) {
    background: none !important;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dashed.default
        .border} !important;

    &:hover {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.default
          .color} !important;
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.hover
          .background} !important;
      border-color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.dashed.default
          .border} !important;
    }

    &:active {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.default
          .color} !important;
      background: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.default.active
          .background} !important;
      border-color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.dashed.default
          .border} !important;
    }
  }

  &.basic-button-wrapper.ant-btn-dashed:disabled,
  &.basic-button-wrapper.ant-btn-dashed.ant-btn-disabled {
    background: none !important;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dashed.default
        .border} !important;
    opacity: 1 !important;
  }

  /* dangerous */
  &.basic-button-wrapper.ant-btn-dangerous {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicButton.dangerous.default
        .color} !important;

    &:disabled,
    &.ant-btn-disabled {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicButton.dangerous.disabled
          .color} !important;
    }
  }

  /* btn-icon-no-border */
  &.basic-button-wrapper.ant-btn-default.btn-icon-no-border {
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
  &.basic-button-wrapper.ant-btn-default.switch-btn-default {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorFillTertiary};
  }

  &.basic-button-wrapper.ant-btn-default.switch-btn-active {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    background: ${({ theme }) => theme.sharedTheme.basic.colorPrimaryBgActive};
  }

  &.basic-button-wrapper.ant-btn-default.has-icon-primary {
    .custom-icon {
      color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorPrimary} !important;
    }
  }
`;
