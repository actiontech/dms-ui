import { useEffect } from 'react';
import AssignmentBatch from './AssignmentBatch';
import AssignmentSingle from './AssignmentSingle';
import ChangeStatus from './ChangeStatus';
import StatusDrawer from './StatusDrawer';
import useSqlManagementRedux from '../hooks/useSqlManagementRedux';
import { ModalName } from '../../../../../data/ModalName';
import CreateSqlManagementException from '../../../../SqlManagementException/Modal/Create';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import AddWhitelist from '../../../../Whitelist/Drawer/AddWhitelist';
import ChangePriority from './ChangePriority';

const SqlManagementModal = () => {
  const { initModalStatus } = useSqlManagementRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Assignment_Member_Single]: false,
      [ModalName.Assignment_Member_Batch]: false,
      [ModalName.Change_Status_Single]: false,
      [ModalName.View_Audit_Result_Drawer]: false,
      [ModalName.Change_SQL_Priority]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreated = () => {
    EventEmitter.emit(EmitterKey.Refresh_SQL_Management);
  };

  return (
    <>
      <AssignmentSingle />
      <StatusDrawer />
      <AssignmentBatch />
      <ChangeStatus />
      <CreateSqlManagementException onCreated={onCreated} />
      <AddWhitelist onCreated={onCreated} />
      <ChangePriority />
    </>
  );
};

export default SqlManagementModal;
