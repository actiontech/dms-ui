import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initMemberModalStatus } from '../../../store/member';
import AddMember from './Member/AddMember';
import UpdateMember from './Member/UpdateMember';
import AddMemberGroup from './MemberGroup/AddMemberGroup';
import UpdateMemberGroup from './MemberGroup/UpdateMemberGroup';

const MemberDrawer: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      initMemberModalStatus({
        modalStatus: {
          [ModalName.DMS_Add_Member]: false,
          [ModalName.DMS_Update_Member]: false,
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
      <AddMemberGroup />
      <UpdateMemberGroup />
    </>
  );
};

export default MemberDrawer;
