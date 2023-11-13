import { styled } from '@mui/material/styles';
import { Select } from 'antd';

export const BasicSelectStyleWrapper = styled(Select<any>)`
  &.ant-select.basic-select-wrapper {
    .ant-select-clear {
      width: 14px;
      height: 14px;
      font-size: 14px;
      margin: auto 0;
      margin-top: -7px;
      background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
      opacity: 1;

      .custom-icon-close {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }
  }

  &.basic-select-wrapper.ant-select:not(.ant-select-customize-input) {
    .ant-select-selector {
      border-radius: 4px;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.default.border};
    }
  }

  .ant-select-selector > .ant-select-selection-placeholder {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.default.placeholder.color};
  }

  &.ant-select:not(.ant-select-focused):not(.ant-select-status-error):not(
      .ant-select-disabled
    ):not(.ant-select-customize-input) {
    .ant-select-selector:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.hover.border};
    }
  }

  &.ant-select-focused {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.active.border};
    }
  }

  &.ant-select-disabled {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.border};
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.background};
    }
  }

  &.ant-select-status-error {
    .ant-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.error.border};
    }
  }
`;
