import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/dms-kit';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import UserGuideModal from './UserGuideModal';
import { useMedia } from '@actiontech/shared';
import { EmptyBox } from '@actiontech/dms-kit';

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
  const { isMobile } = useMedia();
  return (
    <LayoutStyleWrapper>
      {/* #if [ee] */}
      <EmptyBox if={!isMobile}>
        <EESideMenu />
      </EmptyBox>
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
