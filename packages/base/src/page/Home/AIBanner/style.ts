import { styled } from '@mui/material/styles';

export const AIBannerStyleWrapper = styled('div')`
  margin: 20px ${({ theme }) => theme.baseTheme.guidance.padding}px;
  margin-bottom: ${({ theme }) => theme.baseTheme.guidance.gap}px;

  .ai-banner-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};

    .ant-card-body {
      padding: 24px;
    }
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 32px;

    .left-section {
      flex: 1;
      background: #f1f2ff;
      min-width: 300px;
      padding: 20px;
      border-radius: 8px;

      .insight-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .insight-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
          border-radius: 6px;
          color: #fff;
          font-size: 18px;

          svg {
            width: 18px;
            height: 18px;
            stroke: #fff;
          }
        }

        .insight-title {
          font-size: 18px;
          font-weight: 600;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
        }
      }

      .insight-description {
        font-size: 14px;
        line-height: 22px;
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
        margin-bottom: 16px;
      }

      .view-report-link {
        font-size: 14px;
        color: #722ed1;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: color 0.3s;

        &:hover {
          color: #9254de;
        }
      }
    }

    .middle-section {
      display: flex;
      gap: 0;
      padding: 0 32px;
      margin-left: auto;

      .metric-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 140px;
        padding: 0 30px;
        border-left: 1px solid
          ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

        &:first-of-type {
          border-left: none;
          margin-right: 32px;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

          .metric-icon {
            font-size: 16px;
          }

          .metric-label {
            font-size: 14px;
          }
        }

        .metric-value {
          font-size: 32px;
          font-weight: 600;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
          line-height: 1;

          .metric-unit {
            font-size: 16px;
            font-weight: 400;
            color: ${({ theme }) =>
              theme.sharedTheme.uiToken.colorTextSecondary};
            margin-left: 4px;
          }
        }

        .metric-tag {
          align-self: flex-start;
          margin-top: 4px;
        }
      }
    }

    .right-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      min-width: 180px;
      padding-left: 32px;
      border-left: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};

      .action-button {
        width: 100%;
        height: 40px;
        border-radius: 6px;
        font-size: 14px;

        &.primary-button {
          background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
          border: none;
          color: #fff;

          &:hover {
            background: linear-gradient(135deg, #9254de 0%, #b37feb 100%);
            color: #fff;
          }
        }

        &.secondary-button {
          background: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
          border: 1px solid
            ${({ theme }) => theme.sharedTheme.uiToken.colorBorder};
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};

          &:hover {
            border-color: #722ed1;
            color: #722ed1;
          }
        }
      }
    }
  }
`;
