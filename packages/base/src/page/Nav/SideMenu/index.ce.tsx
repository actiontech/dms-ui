import {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_NAME
} from '@actiontech/shared/lib/data/common';
import { Typography } from 'antd5';
import { IconProjectFlag } from 'sqle/src/icon/Rule';
import ProjectTitle from './ProjectTitle';
import UserMenu from './UserMenu';
import {
  CEModeProjectWrapperStyleWrapper,
  SideMenuStyleWrapper
} from './style';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import MenuList from './MenuList';

const CESideMenu = () => {
  const { username, theme, updateTheme, isAdmin } = useCurrentUser();

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

        <MenuList projectID={DEFAULT_PROJECT_ID} isAdmin={isAdmin} />
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
