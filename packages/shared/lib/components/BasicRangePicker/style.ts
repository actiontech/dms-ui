import { styled } from '@mui/material/styles';
import { DatePicker } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicRangePickerStyleWrapper = styled(DatePicker.RangePicker)`
  &.${ANTD_PREFIX_STR}-picker-range.basic-range-picker-wrapper {
    .${ANTD_PREFIX_STR}-picker-clear {
      background-color: transparent;
      opacity: 1;

      .custom-icon-close {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }

    .${ANTD_PREFIX_STR}-picker-range-separator {
      .custom-icon-arrow-right {
        color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
      }
    }
  }

  &.custom-picker-prefix.basic-range-picker-wrapper {
    .${ANTD_PREFIX_STR}-picker-suffix {
      margin-left: 1px;
      margin-right: 10px;
      order: -1;
    }
  }

  &.${ANTD_PREFIX_STR}-picker-range:not(.${ANTD_PREFIX_STR}-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.default.border};
    border-radius: 4px;
  }

  .${ANTD_PREFIX_STR}-picker-input {
    input::placeholder {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicRangePicker.default.placeholder
          .color};
    }
  }

  &.${ANTD_PREFIX_STR}-picker-range:hover:not(.${ANTD_PREFIX_STR}-picker-focused):not(
      .${ANTD_PREFIX_STR}-picker-borderless
    ):not(.${ANTD_PREFIX_STR}-picker-status-error):not(
      .${ANTD_PREFIX_STR}-picker-disabled
    ) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.hover.border};
  }

  &.${ANTD_PREFIX_STR}-picker-focused:not(.${ANTD_PREFIX_STR}-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.active.border};
  }

  &.${ANTD_PREFIX_STR}-picker-status-error:not(.${ANTD_PREFIX_STR}-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.error.border};
  }

  &.${ANTD_PREFIX_STR}-picker-disabled:not(.${ANTD_PREFIX_STR}-picker-borderless) {
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicRangePicker.disabled.border};
  }
`;
