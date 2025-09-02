import AccountDetailModal from './Detail';
import AccountAuthorizeModal from './Authorize';
import ModifyPasswordModal from './ModifyPassword';
import RenewalPasswordModal from './RenewalPassword';
import BatchModifyPasswordModal from './BatchModifyPassword';
import ManagePasswordModal from './ManagePassword';
import AccountDiscoveryModal from './AccountDiscovery';

const DatabaseAccountModal = () => {
  return (
    <>
      <AccountDiscoveryModal />
      <AccountDetailModal />
      <AccountAuthorizeModal />
      <ModifyPasswordModal />
      <RenewalPasswordModal />
      <BatchModifyPasswordModal />
      <ManagePasswordModal />
    </>
  );
};

export default DatabaseAccountModal;
