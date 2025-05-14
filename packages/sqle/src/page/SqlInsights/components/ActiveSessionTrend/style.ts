import { styled } from '@mui/material/styles';
import { SQL_INSIGHTS_CHART_HEIGHT } from '../../index.data';

export const ActiveSessionTrendStyleWrapper = styled('div')`
  margin-top: 16px;
  padding: 20px;

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .active-session-trend-chart {
    height: ${SQL_INSIGHTS_CHART_HEIGHT}px;
  }
`;
