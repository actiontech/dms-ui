import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initUserManageModalStatus } from '../../../store/userCenter';
import UserModal from './User';
import UserGroupModal from './UserGroup';
import RoleModal from './Role';

const UserManageModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.DMS_Add_User]: false,
          [ModalName.DMS_Update_User]: false,
          [ModalName.DMS_Add_Role]: false,
          [ModalName.DMS_Update_Role]: false,
          [ModalName.DMS_Add_User_Group]: false,
          [ModalName.DMS_Update_User_Group]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <UserModal />
      <UserGroupModal />
      <RoleModal />
    </>
  );
};

export default UserManageModal;
