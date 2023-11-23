import { ReactNode } from 'react';
import { LayoutStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';

/* IFTRUE_isEE */
import EESideMenu from './SideMenu';
/* FITRUE_isEE */

/* IFTRUE_isCE */
import CESideMenu from './SideMenu/index.ce';
/* FITRUE_isCE */

const Nav: React.FC<{ children?: ReactNode }> = (props) => {
  return (
    <LayoutStyleWrapper>
      {/* IFTRUE_isEE */}
      <EESideMenu />
      {/* FITRUE_isEE */}

      {/* IFTRUE_isCE */}
      <CESideMenu />
      {/* FITRUE_isCE */}

      <div className="dms-layout-content">{props.children}</div>
    </LayoutStyleWrapper>
  );
};

export default Nav;
