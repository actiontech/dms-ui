import { ReactNode } from 'react';

export type LazyLoadComponentProps = {
  open?: boolean;
  animation?: string;

  forceRender?: boolean;
  destroyOnClose?: boolean;
  className?: string;

  children: ReactNode;
};
