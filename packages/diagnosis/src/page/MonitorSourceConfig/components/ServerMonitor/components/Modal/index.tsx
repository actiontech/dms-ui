import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initMonitorSourceConfigModalStatus } from '../../../../../../store/monitorSourceConfig';
import { ModalName } from '../../../../../../data/ModalName';
import AddServerMonitor from './AddServerMonitor';
import UpdateServerMonitor from './UpdateServerMonitor';

const ServerMonitorModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initMonitorSourceConfigModalStatus({
        modalStatus: {
          [ModalName.Add_Server_Monitor]: false,
          [ModalName.Update_Server_Monitor]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddServerMonitor />
      <UpdateServerMonitor />
    </>
  );
};

export default ServerMonitorModal;
