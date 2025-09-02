import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
import CompanyNoticeModal from './Modal/CompanyNoticeModal';
import VersionModal from './Modal/VersionModal';
import PlatformMetricsModal from './Modal/PlatformMetricsModal';

const UserMenu: React.FC<UserMenuProps> = ({ language, username }) => {
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
        <GlobalSetting />
      </div>
      <VersionModal
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #if [ee] */}
      <CompanyNoticeModal />
      {/* #endif */}
      <PlatformMetricsModal />
    </>
  );
};

export default UserMenu;
