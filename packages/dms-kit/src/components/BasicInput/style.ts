import { styled } from '@mui/material/styles';
import { Input } from 'antd';

const ComponentType = {
  Input,
  TextArea: Input.TextArea,
  Password: Input.Password
};

export const StyleComponent = (type: keyof typeof ComponentType) => {
  const Component = ComponentType[type] as any;
  return styled(Component)`
    .basic-input-wrapper {
      .ant-input-clear-icon {
        font-size: 14px !important;
        background-color: transparent !important;

        .custom-icon-close {
          color: ${({ theme }) => theme.sharedTheme.basic.colorDefaultIcon};
        }
      }
    }

    &.basic-input-wrapper.ant-input:not(.ant-input-borderless):not(
        .ant-input-affix-wrapper-borderless
      ),
    &.basic-input-wrapper.ant-input-affix-wrapper:not(
        .ant-input-affix-wrapper-focused
      ):not(.ant-input-affix-wrapper-borderless) {
      border-radius: 4px;
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.default.border};
    }

    &.basic-input-wrapper::placeholder {
      color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.default.placeholder.color};
    }

    &.basic-input-wrapper:hover:not(:focus):not(.ant-input-status-error):not(
        .ant-input-affix-wrapper-status-error
      ):not(.ant-input-disabled):not(.ant-input-affix-wrapper-disabled):not(
        .ant-input-affix-wrapper-focused
      ):not(.ant-input-borderless):not(.ant-input-affix-wrapper-borderless):not(
        .ant-input-group-wrapper
      ) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.hover.border};
    }

    &.basic-input-wrapper.ant-input-group-wrapper:hover {
      border: none;
    }

    &.basic-input-wrapper.ant-input:not(.ant-input-borderless):focus {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border};
      caret-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.caretColor};
    }

    &.basic-input-wrapper[disabled] {
      background-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.disabled.background};
    }

    &.basic-input-wrapper[disabled]:not(.ant-input-borderless):not(
        .ant-input-affix-wrapper-borderless
      ) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.disabled.border};
    }

    &.basic-input-wrapper.ant-input-status-error:not(.ant-input-borderless) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.ant-input-affix-wrapper-focused {
      caret-color: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.caretColor};
    }

    &.basic-input-wrapper.ant-input-affix-wrapper-focused:not(
        .ant-input-affix-wrapper-borderless
      ) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.focus.border};
      border-radius: 4px;
    }

    &.basic-input-wrapper.ant-input-affix-wrapper-status-error:not(
        .ant-input-affix-wrapper-borderless
      ) {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.ant-input-status-error:not(.ant-input-disabled):not(
        .ant-input-borderless
      ).ant-input:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.ant-input-affix-wrapper-status-error:not(
        .ant-input-affix-wrapper-disabled
      ):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:hover {
      border: ${({ theme }) =>
        theme.sharedTheme.components.basicInput.error.border};
    }

    &.basic-input-wrapper.ant-input-affix-wrapper {
      .ant-input-suffix {
        .ant-input-data-count {
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
