import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initMonitorSourceConfigModalStatus } from '../../../../../../store/monitorSourceConfig';
import { ModalName } from '../../../../../../data/ModalName';
import AddDatabaseMonitor from './AddDatabaseMonitor';

const DatabaseMonitorModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initMonitorSourceConfigModalStatus({
        modalStatus: {
          [ModalName.Add_Database_Monitor]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddDatabaseMonitor />
    </>
  );
};

export default DatabaseMonitorModal;
