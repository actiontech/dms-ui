import AssignmentBatch from './AssignmentBatch';
import AssignmentSingle from './AssignmentSingle';
import ChangeStatus from './ChangeStatus';
import StatusDrawer from './StatusDrawer';

const SqleManagementModal = () => {
  return (
    <>
      <AssignmentSingle />
      <StatusDrawer />
      <AssignmentBatch />
      <ChangeStatus />
    </>
  );
};

export default SqleManagementModal;
