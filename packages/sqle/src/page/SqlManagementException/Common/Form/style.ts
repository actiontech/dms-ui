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

  .match-row-content-single-line.ant-input {
    height: ${ComponentControlHeight.default}px;
    min-height: ${ComponentControlHeight.default}px;
    resize: none;
    overflow: hidden;
  }

  .match-row-sql-snippet {
    box-sizing: border-box;
    height: ${ComponentControlHeight.default}px;
    min-height: ${ComponentControlHeight.default}px;
    padding: 4px 11px;
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicInput.default.border};
    background-color: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    font-size: 14px;
    line-height: 1.5714285714285714;
    overflow: hidden;
    transition: border-color 0.2s;

    &:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.hover.border};
    }

    .actiontech-sql-snippet-renderer-wrapper {
      display: block;
      width: 100%;
      max-width: 100%;

      .ant-typography {
        height: auto;
        min-height: 0;
        margin-bottom: 0;
        white-space: pre-wrap;
        word-break: break-all;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
      }
    }
  }

  .match-row-sql-expand,
  .match-row-sql-toggle {
    flex-shrink: 0;
    font-size: 13px;
    line-height: 20px;
    white-space: nowrap;
  }
`;
