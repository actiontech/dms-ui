import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initMonitorSourceConfigModalStatus } from '../../../../../../store/monitorSourceConfig';
import { ModalName } from '../../../../../../data/ModalName';
import AddDatabaseMonitor from './AddDatabaseMonitor';
import UpdateDatabaseMonitor from './UpdateDatabaseMonitor';

const DatabaseMonitorModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initMonitorSourceConfigModalStatus({
        modalStatus: {
          [ModalName.Add_Database_Monitor]: false,
          [ModalName.Update_Database_Monitor]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddDatabaseMonitor />
      <UpdateDatabaseMonitor />
    </>
  );
};

export default DatabaseMonitorModal;
