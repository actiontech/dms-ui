import { styled } from '@mui/material/styles';
import { ComponentControlHeight } from '@actiontech/shared/lib/data/common';

export const SqlManagementExceptionFormStyleWrapper = styled('div')`
  .match-row {
    .ant-form-item {
      margin-bottom: 0;
    }
  }

  .match-row-content-single-line.ant-input {
    height: ${ComponentControlHeight.default}px;
    min-height: ${ComponentControlHeight.default}px;
    resize: none;
    overflow: hidden;
  }

  .match-row-sql-snippet {
    .actiontech-sql-snippet-renderer-wrapper {
      .ant-typography {
        height: auto;
        min-height: 26px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  .match-row-sql-toggle {
    display: inline-block;
    margin-top: 4px;
    font-size: 13px;
    line-height: 20px;
  }
`;
