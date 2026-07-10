import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

type WhitelistReduxState = {
  modalStatus: ModalStatus;
  selectWhitelist: IAuditWhitelistResV1 | null;
  detailDrawerOpen: boolean;
  detailDrawerWhitelistId?: number;
};

const initialState: WhitelistReduxState = {
  selectWhitelist: null,
  modalStatus: {},
  detailDrawerOpen: false,
  detailDrawerWhitelistId: undefined
};

const whitelist = createSlice({
  name: 'whitelist',
  initialState,
  reducers: {
    updateSelectWhitelist(
      state,
      {
        payload: { selectRow }
      }: PayloadAction<{ selectRow: IAuditWhitelistResV1 | null }>
    ) {
      state.selectWhitelist = selectRow;
    },
    openWhitelistDetailDrawer(state, { payload }: PayloadAction<number>) {
      state.detailDrawerOpen = true;
      state.detailDrawerWhitelistId = payload;
    },
    closeWhitelistDetailDrawer(state) {
      state.detailDrawerOpen = false;
      state.detailDrawerWhitelistId = undefined;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectWhitelist,
  openWhitelistDetailDrawer,
  closeWhitelistDetailDrawer,
  initModalStatus: initWhitelistModalStatus,
  updateModalStatus: updateWhitelistModalStatus
} = whitelist.actions;

export default whitelist.reducer;
