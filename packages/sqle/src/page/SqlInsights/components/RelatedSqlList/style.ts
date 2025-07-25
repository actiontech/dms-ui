import { styled } from '@mui/material/styles';

export const RelatedSqlListStyleWrapper = styled('div')`
  margin-top: 20px;
  width: 100%;
`;

export const SqlExecutionCostTrendChartStyleWrapper = styled('section')`
  .chart-wrapper {
    width: 800px;
    height: 400px;
  }
`;

export const TooltipAnalyzeButtonStyleWrapper = styled('span')`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
