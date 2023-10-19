import ConnectionDetails from './ConnectionDetails';
import UpdateTemplate from './UpdateTemplate';
import UpdateUserInAuth from './UpdateUserInAuth';
import UpdateExpirationInAuth from './UpdateExpirationInAuth';

const AuthListModal = () => {
  return (
    <>
      <ConnectionDetails />
      <UpdateTemplate />
      <UpdateUserInAuth />
      <UpdateExpirationInAuth />
    </>
  );
};

export default AuthListModal;
