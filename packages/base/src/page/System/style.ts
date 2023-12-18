import { styled } from '@mui/material/styles';

export const SystemStyleWrapper = styled('section')`
  .segmented-wrapper {
    padding: 0 40px;
    height: 56px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }

  .system-form-wrapper {
    width: 640px;

    .config-title-wrapper {
      padding: 60px 0 32px;
      font-size: 24px;
      font-weight: 500;
      line-height: 32px;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};

      &.has-border {
        border-bottom: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      }
      border-bottom: 1px solid
        ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
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

      .desc-wrapper {
        padding: 24px 0 8px;
        border-top: 1px solid
          ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

        .ant-descriptions-item-container {
          height: 20px;

          .ant-descriptions-item-label {
            width: 240px;
          }
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
