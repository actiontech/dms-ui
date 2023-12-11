import { SideMenuStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useChangeTheme from '../../../hooks/useChangeTheme';

const SideMenu: React.FC = () => {
  const { username } = useCurrentUser();
  const { currentTheme, changeTheme } = useChangeTheme();

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />
        <MenuList />
      </div>
      <UserMenu
        username={username}
        updateTheme={changeTheme}
        theme={currentTheme}
      />
    </SideMenuStyleWrapper>
  );
};

export default SideMenu;
