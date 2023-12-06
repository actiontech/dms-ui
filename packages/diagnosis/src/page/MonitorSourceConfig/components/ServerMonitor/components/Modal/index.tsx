import { useEffect } from 'react';
import { ModalName } from '../../../../../../data/ModalName';
import AddServerMonitor from './AddServerMonitor';
import UpdateServerMonitor from './UpdateServerMonitor';
import useMonitorSourceConfigRedux from '../../../../hooks/useMonitorSourceConfigRedux';

const ServerMonitorModal: React.FC = () => {
  const { initModalStatus } = useMonitorSourceConfigRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Add_Server_Monitor]: false,
      [ModalName.Update_Server_Monitor]: false
    });
  }, []);

  return (
    <>
      <AddServerMonitor />
      <UpdateServerMonitor />
    </>
  );
};

export default ServerMonitorModal;
