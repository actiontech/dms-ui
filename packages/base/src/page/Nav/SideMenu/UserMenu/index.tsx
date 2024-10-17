import UserNavigate from './components/UserNavigate';
import { useBoolean } from 'ahooks';
import GlobalSetting from './components/GlobalSetting';
import { UserMenuProps } from './index.type';
import CompanyNoticeModal from './Modal/CompanyNoticeModal';
import VersionModal from './Modal/VersionModal';
import { EmptyBox } from '@actiontech/shared';

const UserMenu: React.FC<UserMenuProps> = ({
  language,
  username,
  isAdmin,
  isCertainProjectManager,
  hasGlobalViewingPermission
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
        <EmptyBox
          if={isAdmin || isCertainProjectManager || hasGlobalViewingPermission}
        >
          <GlobalSetting
            isAdmin={isAdmin}
            isCertainProjectManager={isCertainProjectManager}
            hasGlobalViewingPermission={hasGlobalViewingPermission}
          />
        </EmptyBox>
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
