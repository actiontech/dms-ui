import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import {
  IViewMonitorConfigReply,
  IViewServerReply,
  IViewDatabaseReply
} from '../../api/common';

type MonitorSourceConfigState = {
  modalStatus: ModalStatus;
  selectServerMonitorData: IViewServerReply | null;
  selectDatabaseMonitor: IViewDatabaseReply | null;
  selectMonitorConfigDta: IViewMonitorConfigReply | null;
};

const initialState: MonitorSourceConfigState = {
  modalStatus: {},
  selectServerMonitorData: null,
  selectDatabaseMonitor: null,
  selectMonitorConfigDta: null
};

const monitorSourceConfig = createSlice({
  name: 'monitorSourceConfig',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSelectServerMonitorData: (
      state,
      {
        payload: selectServerMonitorData
      }: PayloadAction<IViewServerReply | null>
    ) => {
      state.selectServerMonitorData = selectServerMonitorData;
    },
    updateSelectMonitorConfigData: (
      state,
      {
        payload: selectMonitorConfigDta
      }: PayloadAction<IViewMonitorConfigReply | null>
    ) => {
      state.selectMonitorConfigDta = selectMonitorConfigDta;
    },
    updateSelectDatabaseMonitorData: (
      state,
      {
        payload: selectDatabaseMonitor
      }: PayloadAction<IViewDatabaseReply | null>
    ) => {
      state.selectDatabaseMonitor = selectDatabaseMonitor;
    }
  }
});

export const {
  initModalStatus: initMonitorSourceConfigModalStatus,
  updateModalStatus: updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData,
  updateSelectDatabaseMonitorData,
  updateSelectMonitorConfigData
} = monitorSourceConfig.actions;

export default monitorSourceConfig.reducer;
