import { styled } from '@mui/material/styles';

export const OrderDetailStyleWrapper = styled('section')<{
  showOrderSteps: boolean;
}>`
  display: flex;

  .order-detail-content {
    width: ${({ showOrderSteps }) =>
      showOrderSteps ? 'calc(100% - 360px)' : '100%'} !important;
  }
`;
