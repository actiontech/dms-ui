import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { commonModalReducer } from '../common';
import { IViewServerReply } from '../../api/common';

type MonitorSourceConfigState = {
  modalStatus: ModalStatus;
  selectServerMonitorData: IViewServerReply | null;
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
        payload: selectServerMonitorData
      }: PayloadAction<IViewServerReply | null>
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
