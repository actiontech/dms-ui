import { styled } from '@mui/material/styles';
import { DatePicker } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicRangePickerStyleWrapper = styled(DatePicker.RangePicker)<{
  hideSuperIcon: boolean;
}>`
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

  .${ANTD_PREFIX_STR}-picker-dropdown {
    .${ANTD_PREFIX_STR}-picker-panel-layout
      .${ANTD_PREFIX_STR}-picker-panel
      .${ANTD_PREFIX_STR}-picker-header {
      padding: 6px;

      .${ANTD_PREFIX_STR}-picker-header-super-prev-btn,
        .${ANTD_PREFIX_STR}-picker-header-super-next-btn {
        height: 22px;
        line-height: 22px;
        padding: 4px;
        display: ${({ hideSuperIcon }) => (hideSuperIcon ? 'none' : 'initial')};
      }

      .${ANTD_PREFIX_STR}-picker-header-prev-btn,
        .${ANTD_PREFIX_STR}-picker-header-next-btn {
        height: 28px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBgLayout};
        padding: 3px 4px;
        display: flex;

        .next-icon,
        .prev-icon {
          height: 22px;
          width: 22px;
          background-color: ${({ theme }) =>
            theme.sharedTheme.basic.colorWhite};
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${({ theme }) =>
            theme.sharedTheme.components.basicRangePicker.dropdown.icon
              .boxShadow};
        }
      }

      .${ANTD_PREFIX_STR}-picker-header-prev-btn {
        border-radius: 6px 0 0 6px;
        margin-right: -2px;
      }

      .${ANTD_PREFIX_STR}-picker-header-next-btn {
        border-radius: 0 6px 6px 0;
        margin-left: -2px;
      }

      .${ANTD_PREFIX_STR}-picker-header-view {
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBgLayout};
        height: 28px;
        line-height: 28px;
        border-radius: 6px;
        font-size: 13px;

        button {
          height: 28px;
          line-height: 28px;
        }
      }
    }

    .${ANTD_PREFIX_STR}-picker-panel-layout
      .${ANTD_PREFIX_STR}-picker-panel
      .${ANTD_PREFIX_STR}-picker-content
      .${ANTD_PREFIX_STR}-picker-time-panel-cell-selected
      .${ANTD_PREFIX_STR}-picker-time-panel-cell-inner {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    & .${ANTD_PREFIX_STR}-picker-footer {
      height: 52px;

      .${ANTD_PREFIX_STR}-picker-ranges {
        height: 100%;
        padding: 12px 16px;

        .${ANTD_PREFIX_STR}-picker-now-btn {
          font-size: 13px;
        }

        .${ANTD_PREFIX_STR}-btn {
          height: 28px;
        }
      }
    }
  }
`;
