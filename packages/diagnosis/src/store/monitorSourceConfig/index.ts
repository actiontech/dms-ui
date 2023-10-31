import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { commonModalReducer } from '../common';
import {
  IViewDatabaseReply,
  IViewServerReply
} from '@actiontech/shared/lib/api/diagnosis/service/common';

type MonitorSourceConfigState = {
  modalStatus: ModalStatus;
  selectServerMonitorData: IViewServerReply | null;
  selectDatabaseMonitor: IViewDatabaseReply | null;
};

const initialState: MonitorSourceConfigState = {
  modalStatus: {},
  selectServerMonitorData: null,
  selectDatabaseMonitor: null
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
  updateSelectDatabaseMonitorData
} = monitorSourceConfig.actions;

export default monitorSourceConfig.reducer;
