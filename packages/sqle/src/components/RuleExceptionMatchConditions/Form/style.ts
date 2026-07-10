import { styled } from '@mui/material/styles';
import { ComponentControlHeight } from '@actiontech/shared/lib/data/common';

export const SqlManagementExceptionFormStyleWrapper = styled('div')`
  .match-row {
    .ant-form-item {
      margin-bottom: 0;
    }

    > .ant-space-item {
      display: flex;
      align-items: center;
    }
  }

  .match-row-actions {
    flex-shrink: 0;
  }

  .match-row-sql-content-item.ant-form-item-has-error .match-row-sql-trigger {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicInput.error.border};
  }
`;

export const MatchRowSqlContentTriggerStyleWrapper = styled('div')`
  &.match-row-sql-trigger {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    height: ${ComponentControlHeight.default}px;
    min-height: ${ComponentControlHeight.default}px;
    padding: 4px 11px;
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicInput.default.border};
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    line-height: 1.5714;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.hover.border};
    }

    &:focus-visible {
      outline: none;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border};
    }
  }

  .match-row-sql-trigger-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .match-row-sql-trigger-placeholder {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicInput.default.placeholder.color};
  }

  .match-row-sql-trigger-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgHover};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }
`;

export const SqlContentEditModalStyleWrapper = styled('div')`
  .match-row-sql-modal-textarea.custom-monaco-editor {
    width: 100%;
    min-height: 480px;
  }
`;
