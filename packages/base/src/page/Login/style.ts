import { styled } from '@mui/material/styles';

export const LoginPageStyleWrapper = styled('section')`
  width: 100vw;
  height: 100vh;
  display: flex;
  min-height: 600px;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const LoginPageLeftStyleWrapper = styled('div')`
  flex: 0 0 auto;
  width: 50%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  min-width: 400px;

  @media (max-width: 1024px) {
    width: 100%;
    height: 300px;
    min-width: unset;
  }

  .banner {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    width: 50%;
    height: 100%;
    filter: blur(0.2px);

    @media (max-width: 1024px) {
      width: 100%;
      height: 300px;
    }
  }

  .login-background-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LoginPageRightStyleWrapper = styled('div')`
  flex: 1;
  min-width: 0;
  height: 100%;
  background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    width: 100%;
    height: calc(100vh - 300px);
    min-height: 400px;
  }

  .login-page-right-content {
    width: 100%;
    max-width: 420px;
    min-width: 320px;

    @media (max-width: 768px) {
      max-width: 100%;
      padding: 0 20px;
    }

    .content-header {
      width: 100%;
      min-height: 56px;
      margin-bottom: 40px;
      display: flex;
      align-items: flex-start;
      gap: 16px;

      .logo {
        display: flex;
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        box-shadow: ${({ theme }) => theme.baseTheme.system.logo.boxShadow};

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }

      .title {
        display: flex;
        min-width: 0;
        flex: 1;
        align-items: center;
        align-self: stretch;
        min-height: 56px;

        .label {
          font-feature-settings: 'case' on;
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          line-height: 1.4;
          word-break: break-word;
          hyphens: auto;

          @media (max-width: 768px) {
            font-size: 24px;
          }

          @media (max-width: 480px) {
            font-size: 20px;
          }
        }

        .label-primary {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[0]};
          margin-right: 8px;
          flex-shrink: 0;
        }

        .label-base {
          color: ${({ theme }) => theme.sharedTheme.nav.title.color[1]};
          flex: 1;
          min-width: 0;
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

  & .ant-btn.other-login-btn {
    width: 100%;
    height: 56px;
    font-size: 14px;
    margin-top: 24px;
    background-color: ${({ theme }) =>
      theme.sharedTheme.basic.colorPrimaryBgHover} !important;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary} !important;
    font-style: normal;
    font-weight: 600 !important;
    border-radius: 6px !important;
    overflow: hidden;
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
