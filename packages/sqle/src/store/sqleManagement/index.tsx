import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { commonModalReducer } from '../common';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

// SqleManagement
type SqleManagementState = {
  modalStatus: ModalStatus;
  selectSqleManagement: null | ISqlManage;
};

const initialState: SqleManagementState = {
  modalStatus: {},
  selectSqleManagement: null
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
    }
  }
});

export const {
  initModalStatus: initSqleManagementModalStatus,
  updateModalStatus: updateSqleManagementModalStatus,
  updateSqleManagement
} = sqleManagement.actions;

export default sqleManagement.reducer;
