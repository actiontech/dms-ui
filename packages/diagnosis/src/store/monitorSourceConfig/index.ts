import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { commonModalReducer } from '../common';

type MonitorSourceConfigState = {
  modalStatus: ModalStatus;
  selectServerMonitorData: any;
};

const initialState: MonitorSourceConfigState = {
  modalStatus: {},
  selectServerMonitorData: null
};

const monitorSourceConfig = createSlice({
  name: 'monitorSourceConfig',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSelectServerMonitorData: (
      state,
      {
        payload: { selectServerMonitorData }
      }: PayloadAction<{ selectServerMonitorData: any }>
    ) => {
      state.selectServerMonitorData = selectServerMonitorData;
    }
  }
});

export const {
  initModalStatus: initMonitorSourceConfigModalStatus,
  updateModalStatus: updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData
} = monitorSourceConfig.actions;

export default monitorSourceConfig.reducer;
