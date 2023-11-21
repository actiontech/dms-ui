import { ReactNode } from 'react';
import { LayoutStyleWrapper } from './style';
import SideMenu from './SideMenu';

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <LayoutStyleWrapper>
      <SideMenu />
      <div className="diagnosis-layout-content">{props.children}</div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
