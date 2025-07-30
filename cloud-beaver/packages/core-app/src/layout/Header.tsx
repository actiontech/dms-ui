import type { ReactNode } from 'react';
import {
  HeaderWrapper,
  HeaderLeft,
  HeaderRight,
  HeaderTitle
} from './style.tsx';

interface HeaderProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export const Header = ({ title, left, right }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <HeaderLeft>{left}</HeaderLeft>
      {title && <HeaderTitle>{title}</HeaderTitle>}
      <HeaderRight>{right}</HeaderRight>
    </HeaderWrapper>
  );
};
