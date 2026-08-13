import { styled } from '@mui/material/styles';
import { USER_ACTIVITY_CHART_HEIGHT } from './utils';

export const UserActivityStyleWrapper = styled('section')`
  &.user-activity-page {
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .page-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
      }

      .page-filters {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
    }

    .summary-card {
      height: 100%;
    }

    .chart-section {
      margin-top: 16px;

      .chart-panel {
        width: 100%;
        height: 440px;

        .card-cont {
          overflow: visible;
          height: calc(100% - 48px);
        }

        .chart-wrapper {
          height: ${USER_ACTIVITY_CHART_HEIGHT}px;

          .chart-box {
            height: ${USER_ACTIVITY_CHART_HEIGHT}px;
            min-height: ${USER_ACTIVITY_CHART_HEIGHT}px;
          }
        }
      }

      .ranking-panel {
        width: 100%;
        height: 440px;
      }
    }

    .chart-card {
      height: 100%;

      .ant-card-body {
        height: calc(100% - 57px);
        overflow: auto;
      }
    }
  }
`;
