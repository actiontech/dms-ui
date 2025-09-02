import { useEffect } from 'react';
import { ModalName } from '../../../../../data/ModalName';
import useUserManagementRedux from '../../../hooks/useUserManagementRedux';
import AddRole from './Modal/AddRole';
import UpdateRole from './Modal/UpdateRole';

const RoleModal: React.FC = () => {
  const { initModalStatus } = useUserManagementRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Add_Role]: false,
      [ModalName.Update_Role]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AddRole />
      <UpdateRole />
    </>
  );
};

export default RoleModal;
