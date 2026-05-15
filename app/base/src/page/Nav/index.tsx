import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/dms-kit';
import useBrowserVersionTips from '../../hooks/useBrowserVersionTips';
import UserGuideModal from './UserGuideModal';
import CompanyNoticeBanner from './CompanyNoticeBanner';
import EESideMenu from './SideMenu';
import CESideMenu from './SideMenu/index.ce';
import CopyrightInformation from './Copyright';

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
        {/* #if [ee] */}
        <CompanyNoticeBanner />
        {/* #endif */}
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
