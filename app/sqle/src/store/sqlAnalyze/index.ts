import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';

interface ResultDrawerData {
  optimizationId: string;
}

type SqlOptimizationReduxState = {
  modalStatus: ModalStatus;
  resultDrawer: {
    currentResultDrawerData: ResultDrawerData | null;
  };
};

const initialState: SqlOptimizationReduxState = {
  modalStatus: {},
  resultDrawer: {
    currentResultDrawerData: null
  }
};

const sqlAnalyze = createSlice({
  name: 'sqlAnalyze',
  initialState,
  reducers: {
    updateResultDrawerData(
      state,
      {
        payload: { resultDrawerData }
      }: PayloadAction<{ resultDrawerData: ResultDrawerData | null }>
    ) {
      state.resultDrawer.currentResultDrawerData = resultDrawerData;
    },
    ...commonModalReducer()
  }
});

export const {
  updateResultDrawerData,
  initModalStatus: initSqlAnalyzeModalStatus,
  updateModalStatus: updateSqlAnalyzeModalStatus
} = sqlAnalyze.actions;

export default sqlAnalyze.reducer;
