import { IDatabaseDriverOption } from '@actiontech/shared/lib/api/base/service/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DatabaseReduxState = {
  driverMeta: IDatabaseDriverOption[];
};

const initialState: DatabaseReduxState = {
  driverMeta: []
};

const dmsDatabase = createSlice({
  name: 'database',
  initialState,
  reducers: {
    updateDriverMeta(state, action: PayloadAction<IDatabaseDriverOption[]>) {
      state.driverMeta = action.payload;
    }
  }
});

export const { updateDriverMeta } = dmsDatabase.actions;

export default dmsDatabase.reducer;
