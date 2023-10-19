import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';

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
  &.${ANTD_PREFIX_STR}-typography.${ANTD_PREFIX_STR}-typography-ellipsis {
    margin-bottom: 0;
  }
`;
