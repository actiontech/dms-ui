import { styled } from '@mui/material/styles';
import { SQL_INSIGHTS_CHART_HEIGHT } from '../../index.data';

export const TopSqlTrendStyleWrapper = styled('div')`
  margin-top: 24px;
  border-radius: 8px;
  padding: 24px 40px;

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 16px 0;
  }

  .top-sql-trend-chart {
    height: ${SQL_INSIGHTS_CHART_HEIGHT}px;
  }
`;
