import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { commonModalReducer } from '../common';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

// SqlManagement
export type SqlManagementState = {
  modalStatus: ModalStatus;
  selectSqlManagement: null | ISqlManage;
  batchSelectSqlManagement: ISqlManage[] | null;
};

const initialState: SqlManagementState = {
  modalStatus: {},
  selectSqlManagement: null,
  batchSelectSqlManagement: null
};

const sqlManagement = createSlice({
  name: 'sqlManagement',
  initialState,
  reducers: {
    ...commonModalReducer(),
    setSqlManagementSelectData: (
      state,
      { payload: selectedData }: PayloadAction<null | ISqlManage>
    ) => {
      state.selectSqlManagement = selectedData;
    },
    setSqlManagementBatchSelectData: (
      state,
      { payload: sqlIdList }: PayloadAction<null | ISqlManage[]>
    ) => {
      state.batchSelectSqlManagement = sqlIdList;
    }
  }
});

export const {
  initModalStatus: initSqlManagementModalStatus,
  updateModalStatus: updateSqlManagementModalStatus,
  setSqlManagementSelectData,
  setSqlManagementBatchSelectData
} = sqlManagement.actions;

export default sqlManagement.reducer;
