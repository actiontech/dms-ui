import type { ReactNode } from 'react';
import { LayoutContainer, HeaderContainer, MainContainer } from './style.tsx';

interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export const Layout = ({ children, header }: LayoutProps) => {
  return (
    <LayoutContainer>
      <HeaderContainer>{header}</HeaderContainer>
      <MainContainer>{children}</MainContainer>
    </LayoutContainer>
  );
};
