import { useEffect } from 'react';
import AssignmentBatch from './AssignmentBatch';
import AssignmentSingle from './AssignmentSingle';
import ChangeStatus from './ChangeStatus';
import StatusDrawer from './StatusDrawer';
import useSqlManagementRedux from '../hooks/useSqlManagementRedux';
import { ModalName } from '../../../../../data/ModalName';

const SqlManagementModal = () => {
  const { initModalStatus } = useSqlManagementRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Assignment_Member_Single]: false,
      [ModalName.Assignment_Member_Batch]: false,
      [ModalName.Change_Status_Single]: false,
      [ModalName.View_Audit_Result_Drawer]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AssignmentSingle />
      <StatusDrawer />
      <AssignmentBatch />
      <ChangeStatus />
    </>
  );
};

export default SqlManagementModal;
