import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
import CompanyNoticeModal from './Modal/CompanyNoticeModal';
import VersionModal from './Modal/VersionModal';
import useChangeTheme from '@actiontech/shared/lib/features/useChangeTheme';

const UserMenu: React.FC<UserMenuProps> = ({ language, username }) => {
  const [
    versionModalOpen,
    { setTrue: setVersionModalOpen, setFalse: setVersionModalClose }
  ] = useBoolean();
  const { currentTheme, changeTheme } = useChangeTheme();
  return (
    <>
      <div className="dms-layout-side-end">
        <UserNavigate
          language={language}
          username={username}
          onOpenVersionModal={setVersionModalOpen}
          currentTheme={currentTheme}
          changeTheme={changeTheme}
        />
        <GlobalSetting />
      </div>
      <VersionModal
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #if [ee] */}
      <CompanyNoticeModal />
      {/* #endif */}
    </>
  );
};

export default UserMenu;
