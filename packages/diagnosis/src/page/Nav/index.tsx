import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import SideMenu from './SideMenu';

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <LayoutStyleWrapper>
      <SideMenu />
      <div className="dms-layout-content">{props.children}</div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
