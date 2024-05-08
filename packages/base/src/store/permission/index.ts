import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PermissionReduxState } from '@actiontech/shared/lib/types/common.type';

const initialState: PermissionReduxState = {
  sqlOptimizationIsSupported: false
};

const dmsPermission = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    updateSqlOptimizationIsSupported(
      state,
      { payload: { isSupported } }: PayloadAction<{ isSupported: boolean }>
    ) {
      state.sqlOptimizationIsSupported = isSupported;
    }
  }
});

export const { updateSqlOptimizationIsSupported } = dmsPermission.actions;

export default dmsPermission.reducer;
