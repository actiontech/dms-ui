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
import QuickActions from './QuickActions';

const CESideMenu = () => {
  const {
    username,
    theme,
    updateTheme,
    isAdmin,
    userRoles,
    language,
    isCertainProjectManager,
    hasGlobalViewingPermission
  } = useCurrentUser();

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />
        {/* #if [sqle] */}
        <QuickActions
          isAdmin={isAdmin}
          hasGlobalViewingPermission={hasGlobalViewingPermission}
        />
        {/* #endif */}
        <CEModeProjectWrapperStyleWrapper>
          <FlagFilled width={18} height={18} className="project-flag-icon" />
          <Typography.Text className="default-project-name">
            {DEFAULT_PROJECT_NAME}
          </Typography.Text>
        </CEModeProjectWrapperStyleWrapper>

        <MenuList projectID={DEFAULT_PROJECT_ID} userRoles={userRoles} />
      </div>

      <UserMenu
        hasGlobalViewingPermission={hasGlobalViewingPermission}
        language={language}
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
