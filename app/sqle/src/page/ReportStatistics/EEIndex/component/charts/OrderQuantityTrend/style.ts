import { styled } from '@mui/material/styles';

export const OrderQuantityTrendExtraStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .label {
    color: ${({ theme }) => theme.sharedTheme.basic.colorFontGrayByWhite};
  }

  .orderQuantityTrend-range {
    .ant-picker-suffix {
      display: none;
    }
  }
`;

export const OrderQuantityTrendAreaChartStyleWrapper = styled('div')`
  height: 100%;
`;
