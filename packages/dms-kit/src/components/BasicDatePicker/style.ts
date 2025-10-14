import { styled } from '@mui/material/styles';

export const BasicDatePickerDropDownStyleWrapper = styled('div')<{
  hideSuperIcon: boolean;
}>`
  .ant-picker-dropdown {
    .ant-picker-panel-layout .ant-picker-panel .ant-picker-header {
      padding: 6px;

      .ant-picker-header-super-prev-btn,
      .ant-picker-header-super-next-btn {
        height: 22px;
        line-height: 22px;
        padding: 4px;
        display: ${({ hideSuperIcon }) => (hideSuperIcon ? 'none' : 'initial')};
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

export const BasicDatePickerFieldStyleWrapper = styled(
  BasicDatePickerDropDownStyleWrapper
)<{
  hideSuperIcon: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;

  .prefix-icon {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
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
`;
