import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';

type SystemReduxState = {
  modalStatus: ModalStatus;
  webTitle: string;
  webLogoUrl?: string;
};

const initialState: SystemReduxState = {
  modalStatus: {},
  webTitle: DMS_DEFAULT_WEB_TITLE
};

const dmsSystem = createSlice({
  name: 'system',
  initialState,
  reducers: {
    updateWebTitleAndLog(
      state,
      {
        payload: { webTitle, webLogoUrl }
      }: PayloadAction<Omit<SystemReduxState, 'modalStatus'>>
    ) {
      state.webLogoUrl = webLogoUrl;
      state.webTitle = webTitle;
    },
    ...commonModalReducer()
  }
});

export const {
  updateWebTitleAndLog,
  initModalStatus: initSystemModalStatus,
  updateModalStatus: updateSystemModalStatus
} = dmsSystem.actions;

export default dmsSystem.reducer;
