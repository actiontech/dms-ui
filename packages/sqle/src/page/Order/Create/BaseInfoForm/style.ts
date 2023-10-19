import { styled } from '@mui/material/styles';
import { IconOrderCreateTitle } from '../../../../icon/Order';

export const IconOrderCreateTitleStyleWrapper = styled(IconOrderCreateTitle)`
  &.title-icon {
    color: ${({ theme }) =>
      theme.sqleTheme.order.createOrder.form.baseInfoTitleIconColor};
  }
`;
