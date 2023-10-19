import { ReactNode } from 'react';
import SideMenu from './SideMenu';
import { LayoutStyleWrapper } from './style';

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <LayoutStyleWrapper>
      <SideMenu />
      <div className="dms-layout-content">{props.children}</div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
