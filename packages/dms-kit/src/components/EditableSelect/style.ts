import { styled } from '@mui/material/styles';

export const EditableSelectStyleWrapper = styled('div')<{
  height: number;
}>`
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  box-shadow: ${({ theme }) =>
    theme.sharedTheme.components.basicSelect.default.boxShadow};
  border-radius: 8px;

  .ant-spin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    max-height: ${({ height }) => `${height}px`};
    overflow: hidden;
  }

  .editable-select-search {
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

    .ant-input {
      height: 28px;
    }
  }

  .editable-select-add-section {
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    padding: 5px 12px;
    box-sizing: content-box;
    display: flex;
    align-items: stretch;

    .edit-mode {
      padding: 4px 0;
    }
  }

  .editable-select-menu {
    border: none;
    flex: 1;
    overflow: auto;
    border-radius: 0;
    box-shadow: none !important;
    padding: 0;

    .menu-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .edit-mode {
        width: 100%;
        padding: 0 8px;
      }

      .editable-select-color-form {
        width: 100%;
      }
    }
  }

  .editable-select-menu-item-active {
    font-weight: 600;
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgActive};
  }

  .add-button-wraper {
    cursor: pointer;
    height: 28px;
    width: 100%;
  }

  .edit-mode {
    width: 100%;
    min-width: 240px;
    padding: 4px 8px;
    box-sizing: border-box;

    &.editable-select-color-form {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .editable-select-form-section + .editable-select-form-section {
      margin-top: 12px;
    }

    .editable-select-form-label {
      margin-bottom: 6px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
      font-size: 12px;
      line-height: 20px;
    }

    .editable-select-color-control {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 24px;
    }

    .editable-select-color-swatch {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-radius: 4px;
      box-sizing: border-box;
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillQuaternary};
    }

    .editable-select-color-value {
      flex: 1;
      min-width: 0;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      font-size: 12px;
      font-family: monospace;
      line-height: 20px;
    }

    .editable-select-color-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 4px;
    }

    .editable-select-color-action {
      padding: 0;
      height: auto;
      font-size: 12px;
    }

    .editable-select-preset-colors {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .editable-select-preset-color {
      width: 20px;
      height: 20px;
      padding: 0;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      border-radius: 4px;
      cursor: pointer;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .editable-select-preset-color-active {
      outline: 2px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
      outline-offset: 1px;
    }

    .editable-select-color-preview {
      display: flex;
      align-items: center;
      min-height: 32px;
      padding: 6px 8px;
      border-radius: 4px;
      background: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillQuaternary};
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;

      button + button {
        margin-left: 8px;
      }
    }
  }

  .editable-select-option-label {
    display: inline-flex;
    align-items: center;
  }

  .editable-select-color-dot {
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export const EditableSelectTriggerStyleWrapper = styled('div')<{
  open: boolean;
  disabled: boolean;
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid
    ${({ theme, open }) =>
      open
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorBorderSecondary};
  padding: 4px 11px;
  min-height: 34px;
  justify-content: space-between;
  border-radius: 4px;

  &:hover {
    border-color: ${({ theme, open }) =>
      open
        ? theme.sharedTheme.uiToken.colorPrimary
        : theme.sharedTheme.uiToken.colorBorder};
  }

  &.editable-select-trigger-disabled {
    cursor: not-allowed;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    border-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .placeholder {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
  }

  .arrow-icon {
    display: flex;
  }

  .editable-select-option-label {
    display: inline-flex;
    align-items: center;
  }

  .editable-select-color-dot {
    width: 6px;
    height: 6px;
    margin-right: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;
