import { styled } from '@mui/material/styles';

export const BasicDatePickerFieldStyleWrapper = styled('div')`
  display: flex;
  align-items: center;
  position: relative;

  &.basic-date-picker-hide-super-icon {
    .ant-picker-header-super-prev-btn,
    .ant-picker-header-super-next-btn {
      display: none;
    }
  }

  .prefix-icon {
    position: absolute;
    left: 12px;
    top: 7px;
    z-index: 99;
  }

  & .ant-picker:not(.ant-picker-borderless):not(.ant-picker-focused) {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  & .ant-picker {
    width: 100%;
    padding-left: 40px !important;
    border-radius: 4px !important;

    &:hover:not(:focus):not(.ant-picker-status-error):not(
        .ant-picker-disabled
      ):not(.ant-picker-focused):not(.ant-picker-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicRangePicker.hover.border};
    }
  }

  .ant-picker-dropdown {
    .ant-picker-panel-layout .ant-picker-panel .ant-picker-header {
      padding: 6px;

      .ant-picker-header-super-prev-btn,
      .ant-picker-header-super-next-btn {
        height: 22px;
        line-height: 22px;
        padding: 4px;
      }

      .ant-picker-header-prev-btn,
      .ant-picker-header-next-btn {
        height: 28px;
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorBgLayout};
        padding: 3px 4px;
        display: flex;

        .next-icon,
        .prev-icon {
          height: 22px;
          width: 22px;
          background-color: var(--color-white-100, #fff);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px 0 rgba(51, 44, 31, 0.12);
        }
      }

      .ant-picker-header-prev-btn {
        border-radius: 6px 0 0 6px;
        margin-right: -2px;
      }

      .ant-picker-header-next-btn {
        border-radius: 0 6px 6px 0;
        margin-left: -2px;
      }

      .ant-picker-header-view {
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

    .ant-picker-panel-layout
      .ant-picker-panel
      .ant-picker-content
      .ant-picker-time-panel-cell-selected
      .ant-picker-time-panel-cell-inner {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    & .ant-picker-footer {
      height: 52px;

      .ant-picker-ranges {
        height: 100%;
        padding: 12px 16px;

        .ant-picker-now-btn {
          font-size: 13px;
        }

        .ant-btn {
          height: 28px;
        }
      }
    }
  }
`;
