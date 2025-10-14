import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/dms-kit';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import UserGuideModal from './UserGuideModal';

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

      <UserGuideModal />
    </LayoutStyleWrapper>
  );
};

export default Nav;
