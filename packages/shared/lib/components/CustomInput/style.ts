import { styled } from '@mui/material/styles';
import BasicInput from '../BasicInput';
import { ANTD_PREFIX_STR } from '../../data/common';

export const CustomInputStyleWrapper = styled(BasicInput)`
  &.${ANTD_PREFIX_STR}-input-affix-wrapper-borderless.custom-input-namespace {
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.border} !important;

    &,
    &:focus {
      box-shadow: none !important;
    }
  }

  &.${ANTD_PREFIX_STR}-input-affix-wrapper.custom-input-namespace {
    &.${ANTD_PREFIX_STR}-input-affix-wrapper-focused {
      box-shadow: none !important;
    }

    .${ANTD_PREFIX_STR}-input-prefix {
      margin-right: 8px !important;
      color: ${({ theme }) =>
        theme.sharedTheme.components.customSelect.content.prefixColor};
      font-size: 13px;
    }

    &:not(.${ANTD_PREFIX_STR}-input-affix-wrapper-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.customSelect.border} !important;

      &:focus {
        &,
        .${ANTD_PREFIX_STR}-input {
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.customSelect.focusBackGroundColor};
        }
      }

      &:hover {
        &,
        .${ANTD_PREFIX_STR}-input {
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.customSelect.hoverBackgroundColor};
        }
      }
    }
  }

  .${ANTD_PREFIX_STR}-input-clear-icon {
    display: flex;
    align-items: center;

    .custom-icon-close {
      color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
    }
  }
`;
