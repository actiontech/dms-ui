import { styled } from '@mui/material/styles';
import { Form } from 'antd';

export const SystemStyleWrapper = styled('section')`
  .system-tab-bar-wrapper {
    padding: 0 40px;
    min-height: 56px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .system-tab-bar {
    padding: 10px 0;
  }

  .system-tab-item {
    appearance: none;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    padding: 4px 12px;
    line-height: 24px;
    border-radius: 4px;
    color: ${({ theme }) => theme.sharedTheme.components.basicSegmented.color};
    font-size: 14px;
  }

  .system-tab-item:hover {
    background: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.hoverBackgroundColor};
  }

  .system-tab-item-active {
    color: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.active.color};
    border: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.active.border};
    box-shadow: ${({ theme }) =>
      theme.sharedTheme.components.basicSegmented.active.boxShadow};
    background: #fff;
  }

  .system-form-wrapper {
    width: 640px;

    .config-title-wrapper {
      padding: 60px 0 32px;
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

      &.has-border {
        border-bottom: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }
    }

    .config-form-wrapper {
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

      .ant-form {
        .switch-field-wrapper {
          padding: 32px 0;

          .ant-form-item {
            margin-bottom: 0;
          }
        }

        > .ant-form-item {
          margin-bottom: 32px;
        }

        .ant-form-item-control-input-content {
          display: flex;
          justify-content: end;
        }

        .config-field-wrapper {
          padding: 32px 0;
          border-top: 1px solid
            ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
        }
      }

      .system-config-button {
        background: ${({ theme }) =>
          theme.baseTheme.system.configButton.backgroundColor};
        border: ${({ theme }) => theme.baseTheme.system.configButton.border};
        width: 40px;
        height: 24px;
        margin-top: 3px;
        border-radius: 20px;
      }
    }
  }
`;

export const DatabaseAccountPasswordPolicyFormStyleWrapper = styled(Form)`
  &.ant-form.ant-form-horizontal {
    padding: 24px 0;

    .ant-checkbox-group {
      width: 100%;

      .ant-checkbox-wrapper {
        width: 100%;
      }
    }
  }
`;

export const DatabaseAccountPasswordPolicyDetailStyleWrapper = styled('ul')`
  padding: 0;
  list-style: none;
`;
