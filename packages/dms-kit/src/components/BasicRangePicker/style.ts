import { styled } from '@mui/material/styles';
import { DatePicker } from 'antd';

export const BasicRangePickerStyleWrapper = styled(DatePicker.RangePicker)`
  &.ant-picker-range.basic-range-picker-wrapper {
    .ant-picker-clear {
      background-color: transparent;
      opacity: 1;

      .custom-icon-close {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }

    .ant-picker-range-separator {
      .custom-icon-arrow-right {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }
  }

  &.custom-picker-prefix.basic-range-picker-wrapper {
    .ant-picker-suffix {
      margin-left: 1px;
      margin-right: 10px;
      order: -1;
    }
  }

  &.ant-picker-range:not(.ant-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.default.border};
    border-radius: 4px;
  }

  .ant-picker-input {
    input::placeholder {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicRangePicker.default.placeholder
          .color};
    }
  }

  &.ant-picker-range:hover:not(.ant-picker-focused):not(
      .ant-picker-borderless
    ):not(.ant-picker-status-error):not(.ant-picker-disabled) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.hover.border};
  }

  &.ant-picker-focused:not(.ant-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.active.border};
  }

  &.ant-picker-status-error:not(.ant-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.error.border};
  }

  &.ant-picker-disabled:not(.ant-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.disabled.border};
  }
`;
