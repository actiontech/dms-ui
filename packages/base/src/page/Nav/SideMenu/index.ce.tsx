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
  const { username, theme, updateTheme, language } = useCurrentUser();

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />

        <CEModeProjectWrapperStyleWrapper>
          <FlagFilled width={18} height={18} className="project-flag-icon" />
          <Typography.Text className="default-project-name">
            {DEFAULT_PROJECT_NAME}
          </Typography.Text>
        </CEModeProjectWrapperStyleWrapper>

        <MenuList projectID={DEFAULT_PROJECT_ID} />
      </div>

      <UserMenu
        language={language}
        username={username}
        updateTheme={updateTheme}
        theme={theme}
      />
    </SideMenuStyleWrapper>
  );
};

export default CESideMenu;
