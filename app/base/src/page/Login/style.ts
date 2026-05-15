import { styled } from '@mui/material/styles';

export const LoginPageStyleWrapper = styled('section')`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const LoginPageLeftStyleWrapper = styled('div')`
  width: 50%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

  .banner {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    width: 50%;
    height: 100%;
    filter: blur(0.2px);
  }

  .login-background-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LoginPageRightStyleWrapper = styled('div')`
  width: 50%;
  height: 100%;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  display: flex;
  align-items: center;
  justify-content: center;

  .login-page-right-content {
    width: 400px;

    .login-tabs {
      .ant-tabs-nav {
        margin-bottom: 32px;
      }

      .ant-tabs-tab {
        font-size: 16px;
        font-weight: 500;
        padding: 12px 0;
      }

      .ant-tabs-ink-bar {
        height: 3px;
      }
    }

    .oauth2-login-form {
      display: flex;
      flex-direction: column;
      align-items: center;

      .oauth2-tips {
        margin-bottom: 32px;
        text-align: center;
        font-size: 14px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        line-height: 22px;
      }

      .oauth2-login-btn {
        width: 100%;
        height: 56px;
        font-size: 14px;
        font-style: normal;
        font-weight: 600 !important;
        border-radius: 6px !important;
        overflow: hidden;
      }
    }

    .content-header {
      width: 100%;
      height: 56px;
      margin-bottom: 40px;
      display: flex;

      .logo {
        display: flex;
        width: 56px;
        height: 56px;
        margin-right: 16px;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        box-shadow: ${({ theme }) => theme.baseTheme.system.logo.boxShadow};

        img {
          max-width: 100%;
        }
      }

      .title {
        display: flex;
        height: 100%;
        align-items: center;
        flex-shrink: 0;
        align-self: stretch;

        .label {
          text-align: center;
          font-feature-settings: 'case' on;
          font-size: 32px;
          font-style: normal;
          font-weight: 700;
          line-height: 56px;
        }

        .label-primary {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[0]};
          margin-right: 10px;
        }

        .label-base {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[1]};
        }
      }
    }
  }

  .login-btn-tooltip-wrapper {
    width: 100%;

    .ant-space-item {
      width: 100%;
    }
  }

  & .ant-btn.login-btn {
    width: 100%;
    height: 56px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600 !important;
    border-radius: 6px !important;
  }

  .login-form-field {
    width: 100%;
    height: 56px !important;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorBgLayout} !important;

    &.ant-input-affix-wrapper-lg {
      padding: 5px 16px;
    }

    border-radius: 6px !important;

    .ant-input {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorBgLayout} !important;
      margin-left: 12px;
      font-size: 14px !important;
    }
  }
`;

export const VerificationCodeReturnButtonStyleWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;
