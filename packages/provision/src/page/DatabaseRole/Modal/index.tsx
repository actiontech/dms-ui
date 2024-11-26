import CreateRole from './CreateRole';
import RoleDetail from './RoleDetail';
import UpdateRole from './UpdateRole';

const DatabaseRoleModal: React.FC = () => {
  return (
    <>
      <CreateRole />
      <UpdateRole />
      <RoleDetail />
    </>
  );
};

export default DatabaseRoleModal;
