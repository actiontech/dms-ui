import { ReactNode } from 'react';

export type LazyLoadComponentProps = {
  open?: boolean;
  animation?: string | false;
  forceRender?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  children: ReactNode;
};
