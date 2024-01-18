import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { commonModalReducer } from '../common';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

// SqleManagement
export type SqleManagementState = {
  modalStatus: ModalStatus;
  selectSqleManagement: null | ISqlManage;
  selectSqlIdList: ISqlManage[] | null;
};

const initialState: SqleManagementState = {
  modalStatus: {},
  selectSqleManagement: null,
  selectSqlIdList: null
};

const sqleManagement = createSlice({
  name: 'sqleManagement',
  initialState,
  reducers: {
    ...commonModalReducer(),
    updateSqleManagement: (
      state,
      { payload: selectedData }: PayloadAction<null | ISqlManage>
    ) => {
      state.selectSqleManagement = selectedData;
    },
    updateSqlIdList: (
      state,
      { payload: sqlIdList }: PayloadAction<null | ISqlManage[]>
    ) => {
      state.selectSqlIdList = sqlIdList;
    }
  }
});

export const {
  initModalStatus: initSqleManagementModalStatus,
  updateModalStatus: updateSqleManagementModalStatus,
  updateSqleManagement,
  updateSqlIdList
} = sqleManagement.actions;

export default sqleManagement.reducer;
