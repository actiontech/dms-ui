import { styled } from '@mui/material/styles';
import { Typography } from 'antd';

export const OrderListStyleWrapper = styled('section')`
  .order-list-table-desc-column {
    max-width: 400px;
  }

  .order-list-table-workflow-name-column {
    max-width: 300px;
  }
`;

export const OrderNameStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.ant-typography.ant-typography-ellipsis {
    margin-bottom: 0;
  }
`;
