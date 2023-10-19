import { styled } from '@mui/material/styles';
import { Card } from 'antd5';
import { ANTD_PREFIX_STR } from '../../data/common';

export const BasicLineChartStyleWrapper = styled(Card)`
  &.${ANTD_PREFIX_STR}-card.${ANTD_PREFIX_STR}-card-bordered {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    padding: 16px 20px;

    .${ANTD_PREFIX_STR}-card-body {
      padding: 0;
      border-radius: none;
    }
  }
`;
