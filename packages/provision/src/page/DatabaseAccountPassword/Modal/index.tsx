import AddPolicy from './Policy/AddPolicy';
import UpdatePolicy from './Policy/UpdatePolicy';

const PasswordSecurityPolicyModal: React.FC = () => {
  return (
    <>
      <AddPolicy />
      <UpdatePolicy />
    </>
  );
};

export default PasswordSecurityPolicyModal;
