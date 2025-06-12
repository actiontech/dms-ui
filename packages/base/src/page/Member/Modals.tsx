import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { initMemberModalStatus } from '../../store/member';
import AddMember from './Drawer/Member/AddMember';
import UpdateMember from './Drawer/Member/UpdateMember';
import ManageMemberGroup from './Modal/Member/ManageMemberGroup';
import AddMemberGroup from './Drawer/MemberGroup/AddMemberGroup';
import UpdateMemberGroup from './Drawer/MemberGroup/UpdateMemberGroup';

const MemberDrawer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      initMemberModalStatus({
        modalStatus: {
          [ModalName.DMS_Add_Member]: false,
          [ModalName.DMS_Update_Member]: false,
          [ModalName.DMS_Manage_Member_Group]: false,
          [ModalName.DMS_Add_Member_Group]: false,
          [ModalName.DMS_Update_Member_Group]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddMember />
      <UpdateMember />
      <ManageMemberGroup />
      <AddMemberGroup />
      <UpdateMemberGroup />
    </>
  );
};

export default MemberDrawer;
