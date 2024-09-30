import ReleaseModal from './ReleaseModal';
import BatchExecuteModal from './BatchExecuteModal';
import AssociateWorkflowModal from './AssociateWorkflowModal';
import OfflineExecModal from './OfflineExecModal';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { initVersionManagementModalStatus } from '../../../../store/versionManagement';

const VersionDetailModal = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const modalStatus = {
      [ModalName.Version_Management_Execute_Modal]: false,
      [ModalName.Version_Management_Release_Modal]: false,
      [ModalName.Version_Management_Associate_Workflow_Modal]: false,
      [ModalName.Version_Management_Offline_Execute_Modal]: false
    };
    dispatch(initVersionManagementModalStatus({ modalStatus }));
  }, [dispatch]);

  return (
    <>
      <ReleaseModal />
      <BatchExecuteModal />
      <AssociateWorkflowModal />
      <OfflineExecModal />
    </>
  );
};

export default VersionDetailModal;
