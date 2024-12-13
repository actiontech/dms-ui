import { styled } from '@mui/material';

export const CustomLoadingIndicatorStyleWrapper = styled('div')`
  &.custom-loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: ${({ theme }) => theme.sharedTheme.basic.colorWhite};
    opacity: 0.9;
    border-radius: 8px;
    box-shadow: 0 4px 12px
      ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};

    .loading-animation-icon {
      position: relative;
      inset-inline-start: 0;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }

    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
      font-size: 14px;
      animation: fade-in-out 2s ease-in-out infinite;
      margin: 16px 0;
    }

    .loading-subtext {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      font-size: 13px;
      text-align: center;
    }

    .ai-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
      border-radius: 50%;
      position: relative;
      animation: ai-icon-pulse 2s ease-in-out infinite;
    }

    .ai-icon::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: inherit;
      border-radius: 50%;
      filter: blur(6px);
      opacity: 0;
      animation: ai-icon-glow 2s ease-in-out infinite;
    }

    @keyframes fade-in-out {
      0%,
      100% {
        opacity: 0.7;
      }

      50% {
        opacity: 1;
      }
    }

    @keyframes ai-icon-pulse {
      0%,
      100% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.1);
      }
    }

    @keyframes ai-icon-glow {
      0%,
      100% {
        opacity: 0;
        transform: scale(1);
      }

      50% {
        opacity: 0.3;
        transform: scale(1.2);
      }
    }

    /* 响应式调整 */
    @media screen and (max-width: 576px) {
      .custom-loading-container {
        padding: 16px;
      }

      .loading-text {
        font-size: 13px;
      }

      .loading-subtext {
        font-size: 12px;
      }

      .ai-icon {
        width: 16px;
        height: 16px;
      }
    }
  }
`;
