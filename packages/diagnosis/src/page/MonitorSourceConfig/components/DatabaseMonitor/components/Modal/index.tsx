import { useEffect } from 'react';
import { ModalName } from '../../../../../../data/ModalName';
import AddDatabaseMonitor from './AddDatabaseMonitor';
import UpdateDatabaseMonitor from './UpdateDatabaseMonitor';
import useMonitorSourceConfigRedux from '../../../../hooks/useMonitorSourceConfigRedux';

const DatabaseMonitorModal: React.FC = () => {
  const { initModalStatus } = useMonitorSourceConfigRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Add_Database_Monitor]: false,
      [ModalName.Update_Database_Monitor]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AddDatabaseMonitor />
      <UpdateDatabaseMonitor />
    </>
  );
};

export default DatabaseMonitorModal;
