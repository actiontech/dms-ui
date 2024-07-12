import {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_NAME
} from '@actiontech/shared/lib/data/common';
import { Typography } from 'antd';
import ProjectTitle from './ProjectTitle';
import UserMenu from './UserMenu';
import { CEModeProjectWrapperStyleWrapper } from './style';
import { SideMenuStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import MenuList from './MenuList';
import { FlagFilled } from '@actiontech/icons';

const CESideMenu = () => {
  const {
    username,
    theme,
    updateTheme,
    isAdmin,
    role,
    isCertainProjectManager
  } = useCurrentUser();

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />

        <CEModeProjectWrapperStyleWrapper>
          <FlagFilled width={18} height={18} />
          <Typography.Text className="default-project-name">
            {DEFAULT_PROJECT_NAME}
          </Typography.Text>
        </CEModeProjectWrapperStyleWrapper>

        <MenuList projectID={DEFAULT_PROJECT_ID} role={role} />
      </div>

      <UserMenu
        username={username}
        updateTheme={updateTheme}
        isAdmin={isAdmin}
        theme={theme}
        isCertainProjectManager={isCertainProjectManager}
      />
    </SideMenuStyleWrapper>
  );
};

export default CESideMenu;
