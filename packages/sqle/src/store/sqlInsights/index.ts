import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { Dayjs } from 'dayjs';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
type SqlInsightsReduxState = {
  modalStatus: ModalStatus;
  relateSqlList: {
    selectedDateRange: [Dayjs, Dayjs] | null;
    selectedRecord: IRelatedSQLInfo | null;
  };
};

const initialState: SqlInsightsReduxState = {
  modalStatus: {},
  relateSqlList: {
    selectedDateRange: null,
    selectedRecord: null
  }
};

const sqlInsights = createSlice({
  name: 'sqlInsights',
  initialState,
  reducers: {
    updateRelateSqlListDateRange(
      state,
      {
        payload: { dateRange }
      }: PayloadAction<{ dateRange: [Dayjs, Dayjs] | null }>
    ) {
      state.relateSqlList.selectedDateRange = dateRange;
    },
    updateRelateSqlSelectedRecord(
      state,
      { payload: { record } }: PayloadAction<{ record: IRelatedSQLInfo | null }>
    ) {
      state.relateSqlList.selectedRecord = record;
    },
    ...commonModalReducer()
  }
});

export const {
  updateRelateSqlListDateRange,
  updateRelateSqlSelectedRecord,
  initModalStatus: initSqlInsightsModalStatus,
  updateModalStatus: updateSqlInsightsModalStatus
} = sqlInsights.actions;

export default sqlInsights.reducer;
