import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
import CompanyNoticeModal from './Modal/CompanyNoticeModal';
import VersionModal from './Modal/VersionModal';

const UserMenu: React.FC<UserMenuProps> = ({
  language,
  username,
  isAdmin,
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
          language={language}
          username={username}
          onOpenVersionModal={setVersionModalOpen}
        />
        <GlobalSetting
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
