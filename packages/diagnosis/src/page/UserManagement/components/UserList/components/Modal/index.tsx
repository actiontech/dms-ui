import { useEffect } from 'react';
import { ModalName } from '../../../../../../data/ModalName';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';
import useUserManagementRedux from '../../../../hooks/useUserManagementRedux';

const UserModal: React.FC = () => {
  const { initModalStatus } = useUserManagementRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Add_User]: false,
      [ModalName.Update_User]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AddUser />
      <UpdateUser />
    </>
  );
};

export default UserModal;
