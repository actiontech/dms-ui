import { useEffect } from 'react';
import { ModalName } from '../../../../../../data/ModalName';
import CheckMonitorConfig from './CheckMonitorConfig';
import useMonitorSourceConfigRedux from '../../../../hooks/useMonitorSourceConfigRedux';

const MonitorConfigModal: React.FC = () => {
  const { initModalStatus } = useMonitorSourceConfigRedux();

  useEffect(() => {
    initModalStatus({
      [ModalName.Check_Monitor_Config]: false
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CheckMonitorConfig />
    </>
  );
};

export default MonitorConfigModal;
