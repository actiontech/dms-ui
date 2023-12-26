import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
// #if [ee]
import CompanyNoticeModal from './components/CompanyNoticeModal';
// #endif

// #if [ee && !demo && sqle ]
import SQLEVersionModalEE from './Modal/VersionModal.sqle.ee';
// #else
import SQLEVersionModalCE from './Modal/VersionModal.sqle.ce';
// #endif

const UserMenu: React.FC<UserMenuProps> = ({
  username,
  updateTheme,
  isAdmin,
  theme
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
        />
      </div>
      {/* #if [ee && !demo && sqle ] */}
      <SQLEVersionModalEE
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #else */}
      <SQLEVersionModalCE
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #endif */}
      {/* #if [ee] */}
      <CompanyNoticeModal />
      {/* #endif */}
    </>
  );
};

export default UserMenu;
