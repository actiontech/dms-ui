import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
// #if [ee]
import CompanyNoticeModal from './Modal/CompanyNoticeModal';
// #endif
import VersionModal from './Modal/VersionModal';

const UserMenu: React.FC<UserMenuProps> = ({
  username,
  updateTheme,
  isAdmin,
  theme,
  isCertainProjectManager
}) => {
  const [
    versionModalOpen,
    { setTrue: setVersionModalOpen, setFalse: setVersionModalClose }
  ] = useBoolean();

  return (
    <>
      <div className="dms-layout-side-end">
        <UserNavigate
          username={username}
          setVersionModalOpen={setVersionModalOpen}
        />
        <GlobalSetting
          theme={theme}
          updateTheme={updateTheme}
          isAdmin={isAdmin}
          isCertainProjectManager={isCertainProjectManager}
        />
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
