import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initUserManageModalStatus } from '../../../store/userCenter';
import UserDrawer from './User';
import RoleDrawer from './Role';

const UserManageDrawer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initUserManageModalStatus({
        modalStatus: {
          [ModalName.DMS_Add_User]: false,
          [ModalName.DMS_Update_User]: false,
          [ModalName.DMS_Add_Role]: false,
          [ModalName.DMS_Update_Role]: false,
          [ModalName.DMS_Clone_Role]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <UserDrawer />
      <RoleDrawer />
    </>
  );
};

export default UserManageDrawer;
