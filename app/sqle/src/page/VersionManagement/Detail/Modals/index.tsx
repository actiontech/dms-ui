import ReleaseDrawer from './ReleaseDrawer';
import BatchExecuteModal from './BatchExecuteModal';
import AssociateWorkflowDrawer from './AssociateWorkflowDrawer';
import OfflineExecModal from './OfflineExecModal';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { initVersionManagementModalStatus } from '../../../../store/versionManagement';

const VersionDetailModals = () => {
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
      <ReleaseDrawer />
      <BatchExecuteModal />
      <AssociateWorkflowDrawer />
      <OfflineExecModal />
    </>
  );
};

export default VersionDetailModals;
