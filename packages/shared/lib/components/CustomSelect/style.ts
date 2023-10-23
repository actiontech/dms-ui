import { ANTD_PREFIX_STR } from '../../data/common';
import { styled } from '@mui/material/styles';
import BasicSelect from '../BasicSelect';
import BasicInput from '../BasicInput/Input';

export const CustomSelectStyleWrapper = styled(BasicSelect)`
  &.${ANTD_PREFIX_STR}-select-borderless.custom-select-namespace {
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.border} !important;
  }
  &.${ANTD_PREFIX_STR}-select-borderless.custom-select-namespace.antd-v5-select-disabled {
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.disabled.border};
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.disabled.background};
  }
  &.${ANTD_PREFIX_STR}-select.custom-select-namespace {
    .${ANTD_PREFIX_STR}-select-selector {
      border-radius: 4px;
      min-width: 130px;

      .${ANTD_PREFIX_STR}-select-selection-placeholder {
        .custom-select-placeholder {
          display: inline-flex;
          align-items: center;

          &-value {
            margin-left: 8px;
          }
        }
      }

      .${ANTD_PREFIX_STR}-select-selection-item {
        .custom-select-option-content {
          display: inline-flex;
          align-items: center;
          max-width: 100%;
        }
      }
    }
  }

  &:not(.${ANTD_PREFIX_STR}-select-multiple).custom-select-namespace {
    .${ANTD_PREFIX_STR}-select-selector {
      display: flex;
      align-items: center;
      padding: 0 8px;
    }
  }

  &.${ANTD_PREFIX_STR}-select-multiple.custom-select-namespace {
    .${ANTD_PREFIX_STR}-select-selector {
      display: flex;
      align-items: center;
      padding: 3px 8px;
      padding-inline-end: 24px;

      .${ANTD_PREFIX_STR}-select-selection-overflow {
        &-item:not(:first-of-type) {
          margin-left: 2px;
        }
      }
    }
  }

  .custom-icon-close {
    color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.iconColor};
  }

  &:hover {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.hoverBackgroundColor};
  }

  &.${ANTD_PREFIX_STR}-select-focused {
    background-color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.focusBackGroundColor};
  }
`;

export const CustomSelectOptionLabelStyleWrapper = styled('span')`
  display: flex;

  .custom-select-option-content-prefix {
    margin-right: 8px;
    color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.content.prefixColor};
  }

  .custom-select-option-content-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.content.labelColor};
  }
`;

export const CustomSelectPlaceholderStyleWrapper = styled('span')`
  color: ${({ theme }) =>
    theme.sharedTheme.components.customSelect.placeholder.color};
`;

export const CustomSelectSearchInputStyleWrapper = styled(BasicInput)`
  &.${ANTD_PREFIX_STR}-input-affix-wrapper.basic-input-wrapper {
    width: 100%;
    border-radius: 0;
    font-weight: 500;
    font-size: 13px;
    height: 36px;
    padding: 0 16px;
    border-bottom: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.searchInput
        .borderBottom} !important;

    &:hover {
      border-bottom: ${({ theme }) =>
        theme.sharedTheme.components.customSelect.searchInput
          .hoverBorderBottom} !important;
    }
  }
`;

export const CustomSelectPopupMenuStyleWrapper = styled('div')`
  padding: 4px 6px 6px;
  width: 100%;
`;
