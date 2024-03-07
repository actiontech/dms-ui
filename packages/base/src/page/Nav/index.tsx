import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import useBrowserVersionTips from '../Login/hooks/useBrowserVersionTips';

// #if [ee]
import EESideMenu from './SideMenu';
// #else
import CESideMenu from './SideMenu/index.ce';
// #endif

// #if [demo || ce]
import CopyrightInformation from './Copyright';
// #endif

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  useBrowserVersionTips();

  return (
    <LayoutStyleWrapper>
      {/* #if [ee] */}
      <EESideMenu />
      {/* #else */}
      <CESideMenu />
      {/* #endif */}

      <div className="dms-layout-content">
        {props.children}
        {/* #if [demo || ce] */}
        <CopyrightInformation />
        {/* #endif */}
      </div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
