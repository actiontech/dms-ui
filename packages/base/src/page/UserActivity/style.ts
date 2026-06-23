import { styled } from '@mui/material/styles';

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
    }

    .chart-card {
      height: 100%;
    }
  }
`;
