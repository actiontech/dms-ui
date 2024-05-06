import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

type WhitelistReduxState = {
  modalStatus: ModalStatus;
  selectWhitelist: IAuditWhitelistResV1 | null;
};

const initialState: WhitelistReduxState = {
  selectWhitelist: null,
  modalStatus: {}
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
    ...commonModalReducer()
  }
});

export const {
  updateSelectWhitelist,
  initModalStatus: initWhitelistModalStatus,
  updateModalStatus: updateWhitelistModalStatus
} = whitelist.actions;

export default whitelist.reducer;
