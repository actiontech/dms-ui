import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initMonitorSourceConfigModalStatus } from '../../../../../../store/monitorSourceConfig';
import { ModalName } from '../../../../../../data/ModalName';
import CheckMonitorConfig from './CheckMonitorConfig';

const MonitorConfigModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initMonitorSourceConfigModalStatus({
        modalStatus: {
          [ModalName.Check_Monitor_Config]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <CheckMonitorConfig />
    </>
  );
};

export default MonitorConfigModal;
