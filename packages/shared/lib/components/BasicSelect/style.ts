import { styled } from '@mui/material/styles';
import { Select } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicSelectStyleWrapper = styled(Select<any>)`
  &.${ANTD_PREFIX_STR}-select.basic-select-wrapper {
    .${ANTD_PREFIX_STR}-select-clear {
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

  &.basic-select-wrapper.${ANTD_PREFIX_STR}-select:not(.${ANTD_PREFIX_STR}-select-customize-input) {
    .${ANTD_PREFIX_STR}-select-selector {
      border-radius: 4px;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.default.border};
    }
  }

  .${ANTD_PREFIX_STR}-select-selector>.${ANTD_PREFIX_STR}-select-selection-placeholder {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicSelect.default.placeholder.color};
  }

  &.${ANTD_PREFIX_STR}-select:not(.${ANTD_PREFIX_STR}-select-focused):not(
      .${ANTD_PREFIX_STR}-select-status-error
    ):not(.${ANTD_PREFIX_STR}-select-disabled):not(
      .${ANTD_PREFIX_STR}-select-customize-input
    ) {
    .${ANTD_PREFIX_STR}-select-selector:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.hover.border};
    }
  }

  &.${ANTD_PREFIX_STR}-select-focused {
    .${ANTD_PREFIX_STR}-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.active.border};
    }
  }

  &.${ANTD_PREFIX_STR}-select-disabled {
    .${ANTD_PREFIX_STR}-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.border};
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.disabled.background};
    }
  }

  &.${ANTD_PREFIX_STR}-select-status-error {
    .${ANTD_PREFIX_STR}-select-selector {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicSelect.error.border};
    }
  }
`;
