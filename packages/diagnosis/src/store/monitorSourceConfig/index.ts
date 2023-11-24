import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IViewMonitorConfigReply, IViewServerReply } from '../../api/common';

type MonitorSourceConfigState = {
  modalStatus: ModalStatus;
  selectServerMonitorData: IViewServerReply | null;
  selectMonitorConfigDta: IViewMonitorConfigReply | null;
};

const initialState: MonitorSourceConfigState = {
  modalStatus: {},
  selectServerMonitorData: null,
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
    }
  }
});

export const {
  initModalStatus: initMonitorSourceConfigModalStatus,
  updateModalStatus: updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData,
  updateSelectMonitorConfigData
} = monitorSourceConfig.actions;

export default monitorSourceConfig.reducer;
