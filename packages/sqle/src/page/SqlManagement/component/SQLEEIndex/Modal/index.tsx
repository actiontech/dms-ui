import AssignmentBatch from './AssignmentBatch';
import AssignmentSingle from './AssignmentSingle';
import StatusDrawer from './StatusDrawer';

const SqleManagementModal = () => {
  return (
    <>
      <AssignmentSingle />
      <StatusDrawer />
      <AssignmentBatch />
    </>
  );
};

export default SqleManagementModal;
