import { styled } from '@mui/material/styles';

export const EditableSelectStyleWrapper = styled('div')<{
  height: number;
}>`
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  max-height: ${({ height }) => `${height}px`};
  box-shadow: ${({ theme }) =>
    theme.sharedTheme.components.basicSelect.default.boxShadow};

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
    align-items: center;
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
    padding: 0 8px;

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
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
`;
