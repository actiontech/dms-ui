import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { styled } from '@mui/material/styles';
import { Typography } from 'antd5';

export const OrderDescStyleWrapper = styled(Typography.Paragraph)`
  max-width: 100%;

  &.${ANTD_PREFIX_STR}-typography.${ANTD_PREFIX_STR}-typography-ellipsis {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    span:not(.anticon-copy):first-of-type {
      display: inline-flex;
      overflow: hidden;
      word-break: keep-all;
    }

    .${ANTD_PREFIX_STR}-typography-copy {
      height: 18px;
      width: 18px;
      opacity: 0;
      border-radius: 4px;
      margin-inline-start: 10px;

      &:hover {
        opacity: 1;
        color: ${({ theme }) =>
          theme.sqleTheme.order.orderList.orderDesc.copyIconColor};
        background-color: ${({ theme }) =>
          theme.sqleTheme.order.orderList.orderDesc
            .hoverCopyIconBackgroundColor} !important;
      }
    }

    &:hover {
      .${ANTD_PREFIX_STR}-typography-copy {
        opacity: 1;
        color: ${({ theme }) =>
          theme.sqleTheme.order.orderList.orderDesc.copyIconColor};
      }
    }
  }
`;

export const OrderStatusStyleWrapper = styled('div')`
  display: flex;
  align-items: center;

  span {
    &:last-of-type {
      margin-left: 8px;
    }
  }
`;
