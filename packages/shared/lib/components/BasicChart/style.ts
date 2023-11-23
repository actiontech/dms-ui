import { styled } from '@mui/material/styles';
import { Card } from 'antd';

export const BasicLineChartStyleWrapper = styled(Card)`
  &.ant-card.ant-card-bordered {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    padding: 16px 20px;

    .ant-card-body {
      padding: 0;
      border-radius: none;
    }
  }
`;
