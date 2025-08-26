import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

type SqlManagementExceptionReduxState = {
  modalStatus: ModalStatus;
  selectSqlManagementExceptionRecord: IBlacklistResV1 | null;
};

const initialState: SqlManagementExceptionReduxState = {
  selectSqlManagementExceptionRecord: null,
  modalStatus: {}
};

const sqlManagementException = createSlice({
  name: 'sqlManagementException',
  initialState,
  reducers: {
    updateSelectSqlManagementException(
      state,
      {
        payload: { selectRow }
      }: PayloadAction<{ selectRow: IBlacklistResV1 | null }>
    ) {
      state.selectSqlManagementExceptionRecord = selectRow;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectSqlManagementException,
  initModalStatus: initSqlManagementExceptModalStatus,
  updateModalStatus: updateSqlManagementExceptModalStatus
} = sqlManagementException.actions;

export default sqlManagementException.reducer;
