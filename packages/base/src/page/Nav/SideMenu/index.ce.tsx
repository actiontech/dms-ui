import {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_NAME
} from '@actiontech/shared/lib/data/common';
import { Typography } from 'antd';
import { IconProjectFlag } from 'sqle/src/icon/Rule';
import ProjectTitle from './ProjectTitle';
import UserMenu from './UserMenu';
import { CEModeProjectWrapperStyleWrapper } from './style';
import { SideMenuStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import MenuList from './MenuList';

const CESideMenu = () => {
  const { username, theme, updateTheme, isAdmin, role } = useCurrentUser();

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />

        <CEModeProjectWrapperStyleWrapper>
          <IconProjectFlag />
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
      />
    </SideMenuStyleWrapper>
  );
};

export default CESideMenu;
