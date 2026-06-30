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
`;
