import { SideMenuStyleWrapper } from './style';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';

const SideMenu: React.FC = () => {
  const { username, theme, updateTheme, isAdmin } = useCurrentUser();

  return (
    <SideMenuStyleWrapper className="diagnosis-layout-side">
      <div className="diagnosis-layout-side-start">
        <ProjectTitle />
        <MenuList isAdmin={isAdmin} />
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

export default SideMenu;
