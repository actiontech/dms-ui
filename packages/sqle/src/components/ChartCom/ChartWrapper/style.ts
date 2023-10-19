import { styled } from '@mui/material/styles';

export const ChartWrapperStyleWrapper = styled('div')`
  &.chart-wrapper {
    &,
    > div,
    .chart-box {
      width: 100%;
      height: 100%;
    }

    > div.icon-center-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -20px;
    }
  }
`;
