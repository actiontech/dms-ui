import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import {
  initMonitorSourceConfigModalStatus,
  updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData,
  updateSelectDatabaseMonitorData,
  updateSelectMonitorConfigData
} from '../../../store/monitorSourceConfig';
import {
  IViewDatabaseReply,
  IViewMonitorConfigReply,
  IViewServerReply
} from '../../../api/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

const useMonitorSourceConfigRedux = (modalName?: ModalName) => {
  const dispatch = useDispatch();

  const modalState = useSelector((state: IReduxState) => ({
    visible: state.monitorSourceConfig.modalStatus[modalName!],
    selectDatabaseData: state.monitorSourceConfig.selectDatabaseMonitor,
    selectMonitorConfigData: state.monitorSourceConfig.selectMonitorConfigDta,
    selectServerData: state.monitorSourceConfig.selectServerMonitorData
  }));

  const initModalStatus = (modalStatus: ModalStatus) => {
    dispatch(initMonitorSourceConfigModalStatus({ modalStatus }));
  };

  const setModalStatus = (name: ModalName, status: boolean) => {
    dispatch(
      updateMonitorSourceConfigModalStatus({
        modalName: name,
        status
      })
    );
  };

  const setDatabaseSelectData = (record: IViewDatabaseReply | null) => {
    dispatch(updateSelectDatabaseMonitorData(record));
  };

  const setMonitorConfigSelectData = (
    record: IViewMonitorConfigReply | null
  ) => {
    dispatch(updateSelectMonitorConfigData(record));
  };

  const setServerSelectData = (record: IViewServerReply | null) => {
    dispatch(updateSelectServerMonitorData(record));
  };

  return {
    ...modalState,
    initModalStatus,
    setModalStatus,
    setDatabaseSelectData,
    setMonitorConfigSelectData,
    setServerSelectData
  };
};

export default useMonitorSourceConfigRedux;
