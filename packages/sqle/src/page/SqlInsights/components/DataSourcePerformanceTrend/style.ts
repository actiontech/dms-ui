import { styled } from '@mui/material/styles';
import { SQL_INSIGHTS_CHART_HEIGHT } from '../../index.data';

export const DataSourcePerformanceTrendStyleWrapper = styled('div')`
  padding: 20px 40px;
  border-radius: 8px;

  .chart-title {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
    margin-bottom: 16px;
  }

  .performance-trend-chart {
    width: 100%;
    height: ${SQL_INSIGHTS_CHART_HEIGHT}px;
  }
`;
