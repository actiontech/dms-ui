import { styled } from '@mui/material';

export const LazyLoadComponentStyleWrapper = styled('div')<{
  animation?: string | false;
}>`
  @keyframes slide-right {
    from {
      display: block;
      transform: translateX(100%);
    }

    to {
      display: none;
    }
  }

  &.lazy-load-wrapper-animation {
    animation: ${({ animation }) => animation || ' slide-right 300ms'};
  }

  &.lazy-load-wrapper-hidden {
    display: none;
  }

  &.lazy-load-wrapper-show {
    display: block;
  }
`;
