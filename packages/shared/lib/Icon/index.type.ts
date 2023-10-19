import { CSSProperties, MouseEventHandler } from 'react';

export type CustomIconProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  color?: string;
  width?: number;
  height?: number;
};
