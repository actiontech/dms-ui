import { styled } from '@mui/material/styles';

export const OverviewStyleWrapper = styled('section')`
  padding: 80px 40px 30px;
  min-width: 880px;
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorFillTertiary};

  .marginTop20 {
    margin-top: 20px;
  }

  .height344 {
    height: 344px;
  }

  .height352 {
    height: 352px;
  }

  .height668 {
    height: 668px;
    overflow-y: auto;
  }

  .chart-area-overview {
    .right-chart {
      height: 716px;
    }
  }
`;
