import { styled } from '@mui/material/styles';
import { Input } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';
import TextArea from 'antd5/es/input/TextArea';
import Password from 'antd5/es/input/Password';

const ComponentType = {
  Input,
  TextArea,
  Password
};

export const StyleComponent = (type: keyof typeof ComponentType) => {
  const Component = ComponentType[type] as any;
  return styled(Component)`
    .basic-input-wrapper {
      .${ANTD_PREFIX_STR}-input-clear-icon {
        font-size: 14px !important;
        background-color: transparent !important;

        .custom-icon-close {
          color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
        }
      }
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input:not(.${ANTD_PREFIX_STR}-input-borderless):not(
        .${ANTD_PREFIX_STR}-input-affix-wrapper-borderless
      ),
    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper:not(.${ANTD_PREFIX_STR}-input-affix-wrapper-focused):not(
        .${ANTD_PREFIX_STR}-input-affix-wrapper-borderless
      ) {
      border-radius: 4px;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.default.border};
    }

    &.basic-input-wrapper::placeholder {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.default.placeholder.color};
    }

    &.basic-input-wrapper:hover:not(:focus):not(
        .${ANTD_PREFIX_STR}-input-status-error
      ):not(.${ANTD_PREFIX_STR}-input-affix-wrapper-status-error):not(
        .${ANTD_PREFIX_STR}-input-disabled
      ):not(.${ANTD_PREFIX_STR}-input-affix-wrapper-disabled):not(
        .${ANTD_PREFIX_STR}-input-affix-wrapper-focused
      ):not(.${ANTD_PREFIX_STR}-input-borderless):not(
        .${ANTD_PREFIX_STR}-input-affix-wrapper-borderless
      ):not(.${ANTD_PREFIX_STR}-input-group-wrapper) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.hover.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-group-wrapper:hover {
      border: none;
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input:not(.${ANTD_PREFIX_STR}-input-borderless):focus {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border};
      caret-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.caretColor};
    }

    &.basic-input-wrapper[disabled] {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.disabled.background};
    }

    &.basic-input-wrapper[disabled]:not(
        .${ANTD_PREFIX_STR}-input-borderless
      ):not(.${ANTD_PREFIX_STR}-input-affix-wrapper-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.disabled.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-status-error:not(.${ANTD_PREFIX_STR}-input-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper-focused {
      caret-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.caretColor};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper-focused:not(.${ANTD_PREFIX_STR}-input-affix-wrapper-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border};
      border-radius: 4px;
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper-status-error:not(.${ANTD_PREFIX_STR}-input-affix-wrapper-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-status-error:not(.${ANTD_PREFIX_STR}-input-disabled):not(
        .${ANTD_PREFIX_STR}-input-borderless
      ).${ANTD_PREFIX_STR}-input:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper-status-error:not(
      .${ANTD_PREFIX_STR}-input-affix-wrapper-disabled
    ):not(
        .${ANTD_PREFIX_STR}-input-affix-wrapper-borderless
      ).${ANTD_PREFIX_STR}-input-affix-wrapper:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.${ANTD_PREFIX_STR}-input-affix-wrapper {
      .${ANTD_PREFIX_STR}-input-suffix {
        .${ANTD_PREFIX_STR}-input-data-count {
          color: ${({ theme }) =>
            theme.sharedTheme.components.basicInput.default.dataCountColor};
          text-align: right;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 16px;
          bottom: 10px !important;
          right: 10px !important;
        }
      }
    }
  `;
};
