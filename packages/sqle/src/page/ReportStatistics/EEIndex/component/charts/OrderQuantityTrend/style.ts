import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';

export const OrderQuantityTrendExtraStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  .label {
    color: ${({ theme }) => theme.sharedTheme.basic.colorFontGrayByWhite};
  }

  .orderQuantityTrend-range {
    .${ANTD_PREFIX_STR}-picker-suffix {
      display: none;
    }
  }
`;

export const OrderQuantityTrendAreaChartStyleWrapper = styled('div')`
  height: 100%;
`;
