import UserNavigate from './UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './GlobalSetting';
import VersionModal from './VersionModal';
import { UserMenuProps } from './index.type';
// #if [prod_version=ee]
import CompanyNoticeModal from './CompanyNoticeModal';
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

      <VersionModal
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #if [prod_version=ee] */}
      <CompanyNoticeModal />
      {/* #endif */}
    </>
  );
};

export default UserMenu;
