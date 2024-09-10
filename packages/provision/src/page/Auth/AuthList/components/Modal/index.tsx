import AuthDetailDrawer from './AuthDetailDrawer';
import UpdateExpiration from './UpdateExpiration';
import UpdateTemplate from './UpdateTemplate';
import UpdateUserInAuth from './UpdateUser';

const AuthListModal = () => {
  return (
    <>
      <UpdateUserInAuth />
      <UpdateTemplate />
      <UpdateExpiration />
      <AuthDetailDrawer />
    </>
  );
};

export default AuthListModal;
