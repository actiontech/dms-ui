import AuthDetailDrawer from './AuthDetailDrawer';
import UpdateExpiration from './UpdateExpiration';
import UpdateSQLWorkbenchQueryStatus from './UpdateSQLWorkbenchQueryStatus';
import UpdateTemplate from './UpdateTemplate';
import UpdateUserInAuth from './UpdateUser';

const AuthListModal = () => {
  return (
    <>
      <UpdateUserInAuth />
      <UpdateTemplate />
      <UpdateExpiration />
      <AuthDetailDrawer />
      <UpdateSQLWorkbenchQueryStatus />
    </>
  );
};

export default AuthListModal;
