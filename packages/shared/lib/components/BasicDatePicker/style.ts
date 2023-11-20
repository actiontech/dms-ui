import { ANTD_PREFIX_STR } from '../../data/common';
import { styled } from '@mui/material/styles';

export const BasicDatePickerDropDownStyleWrapper = styled('div')<{
  hideSuperIcon: boolean;
}>`
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

export const BasicDatePickerFieldStyleWrapper = styled(
  BasicDatePickerDropDownStyleWrapper
)<{
  hideSuperIcon: boolean;
}>`
  display: flex;
  align-items: center;
  position: relative;

  .prefix-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
  }

  &
    .${ANTD_PREFIX_STR}-picker:not(.${ANTD_PREFIX_STR}-picker-borderless):not(
      .${ANTD_PREFIX_STR}-picker-focused
    ) {
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  & .${ANTD_PREFIX_STR}-picker {
    width: 100%;
    padding-left: 40px !important;
    border-radius: 4px !important;
    &:hover:not(:focus):not(.${ANTD_PREFIX_STR}-picker-status-error):not(
        .${ANTD_PREFIX_STR}-picker-disabled
      ):not(.${ANTD_PREFIX_STR}-picker-focused):not(
        .${ANTD_PREFIX_STR}-picker-borderless
      ) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicRangePicker.hover.border};
    }
  }
`;
