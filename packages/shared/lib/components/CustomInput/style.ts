import { styled } from '@mui/material/styles';
import BasicInput from '../BasicInput';

export const CustomInputStyleWrapper = styled(BasicInput)`
  &.ant-input-affix-wrapper-borderless.custom-input-namespace {
    border-radius: 4px;
    border: ${({ theme }) =>
      theme.sharedTheme.components.customSelect.border} !important;

    &,
    &:focus {
      box-shadow: none !important;
    }
  }

  &.ant-input-affix-wrapper.custom-input-namespace {
    &.ant-input-affix-wrapper-focused {
      box-shadow: none !important;
    }

    .ant-input-prefix {
      margin-right: 8px !important;
      color: ${({ theme }) =>
        theme.sharedTheme.components.customSelect.content.prefixColor};
      font-size: 13px;
    }

    &:not(.ant-input-affix-wrapper-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.customSelect.border} !important;

      &:focus {
        &,
        .ant-input {
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.customSelect.focusBackGroundColor};
        }
      }

      &:hover {
        &,
        .ant-input {
          background-color: ${({ theme }) =>
            theme.sharedTheme.components.customSelect.hoverBackgroundColor};
        }
      }
    }
  }

  .ant-input-clear-icon {
    display: flex;
    align-items: center;

    .custom-icon-close {
      color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
    }
  }
`;
