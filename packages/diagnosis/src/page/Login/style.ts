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
        box-shadow: ${({ theme }) => theme.diagnosisTheme.login.logo.boxShadow};

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
