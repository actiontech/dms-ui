import { styled } from '@mui/material/styles';

export const EditableSelectStyleWrapper = styled('div')`
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

  .editable-select-menu {
    max-height: 300px;
    overflow: auto;

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

    .add-mode {
      padding: 0 8px;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
  }

  .editable-select-menu-item-active {
    font-weight: 600;
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgActive};
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
  border-radius: 2px;
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
