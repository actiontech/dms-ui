import { styled } from '@mui/material/styles';

export const StrategicInsightStyleWrapper = styled('div')`
  .strategic-insight-header {
    margin-bottom: 16px;
  }

  .strategic-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .value-milestone-banner {
    background: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.StrategicInsight.valueMilestoneBanner
        .background};
    border-radius: 8px;
    padding: 20px 24px;
    color: ${({ theme }) =>
      theme.sqleTheme.reportStatistics.StrategicInsight.valueMilestoneBanner
        .textColor};
    position: relative;
    overflow: hidden;

    .milestone-bg-icon-wrapper {
      position: absolute;
      right: 0;
      top: 0;
      width: 284px;
      height: 284px;
      padding: 32px;
      box-sizing: border-box;
      overflow: hidden;
      pointer-events: none;
    }

    .milestone-bg-icon {
      width: 100%;
      height: 100%;
      display: block;
      color: ${({ theme }) =>
        theme.sqleTheme.reportStatistics.StrategicInsight.valueMilestoneBanner
          .bgIconColor};
    }

    .milestone-label {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .milestone-content {
      position: relative;
      z-index: 1;

      .milestone-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .milestone-icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight.valueMilestoneBanner
            .iconCircleBgColor};
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .milestone-header-icon {
        width: 24px;
        height: 24px;
        color: ${({ theme }) =>
          theme.sqleTheme.reportStatistics.StrategicInsight.valueMilestoneBanner
            .headerIconColor};
      }

      .milestone-text {
        .milestone-title {
          color: ${({ theme }) =>
            theme.sqleTheme.reportStatistics.StrategicInsight
              .valueMilestoneBanner.textColor} !important;
          margin-bottom: 8px !important;
          font-size: 18px;
          font-weight: 600;
        }

        .milestone-description {
          color: ${({ theme }) =>
            theme.sqleTheme.reportStatistics.StrategicInsight
              .valueMilestoneBanner.descriptionColor} !important;
          margin-bottom: 0 !important;
          font-size: 14px;
          line-height: 1.6;
        }
      }
    }
  }
`;
