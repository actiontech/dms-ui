import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initMemberModalStatus } from '../../../store/member';
import AddMember from './AddMember';
import UpdateMember from './UpdateMember';
import AddMemberGroup from './AddMemberGroup';
import UpdateMemberGroup from './UpdateMemberGroup';

const MemberModal: React.FC = () => {
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

export default MemberModal;
