import { PopoverProps } from 'antd';
import { ReactNode } from 'react';

export type ContextMenuItem = {
  key: string;
  icon?: ReactNode;
  text: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  keepOpenOnClick?: boolean;
  hidden?: boolean;
  disabled?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  children: ReactNode;
  header?: ReactNode;
  popoverProps?: Omit<PopoverProps, 'content'>;
};
