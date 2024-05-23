import { styled } from '@mui/material';

export const LazyLoadComponentStyleWrapper = styled('div')<{
  animation?: string;
}>`
  @keyframes slideAndHide {
    from {
      display: block;
      transform: ${({ animation }) => animation ?? 'translateX(100%)'};
    }
    to {
      display: none;
    }
  }

  animation: slideAndHide 300ms;
  &.lazy-load-wrapper-hidden {
    display: none;
  }
  &.lazy-load-wrapper-show {
    display: block;
  }
`;
