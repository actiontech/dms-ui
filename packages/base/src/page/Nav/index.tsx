import { ReactNode } from 'react';
import { LayoutStyleWrapper } from './style';

// #if [prod_version=ee]
import EESideMenu from './SideMenu';
// #else
import CESideMenu from './SideMenu/index.ce';
// #endif

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <LayoutStyleWrapper>
      {/* #if [prod_version=ee] */}
      <EESideMenu />
      {/* #else */}
      <CESideMenu />
      {/* #endif */}

      <div className="dms-layout-content">{props.children}</div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
