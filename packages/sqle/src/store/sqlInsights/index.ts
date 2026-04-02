import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { Dayjs } from 'dayjs';
import {
  IRelatedSQLInfo,
  IRawSQLRecord
} from '@actiontech/shared/lib/api/sqle/service/common';
type SqlInsightsReduxState = {
  modalStatus: ModalStatus;
  relateSqlList: {
    selectedDateRange: [Dayjs, Dayjs] | null;
    selectedRecord: IRelatedSQLInfo | null;
    expandedRowKeys: string[];
    selectedRawSqlRecord: IRawSQLRecord | null;
  };
};

const initialState: SqlInsightsReduxState = {
  modalStatus: {},
  relateSqlList: {
    selectedDateRange: null,
    selectedRecord: null,
    expandedRowKeys: [],
    selectedRawSqlRecord: null
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
    updateExpandedRowKeys(
      state,
      { payload: { keys } }: PayloadAction<{ keys: string[] }>
    ) {
      state.relateSqlList.expandedRowKeys = keys;
    },
    updateSelectedRawSqlRecord(
      state,
      {
        payload: { record }
      }: PayloadAction<{ record: IRawSQLRecord | null }>
    ) {
      state.relateSqlList.selectedRawSqlRecord = record;
    },
    ...commonModalReducer()
  }
});

export const {
  updateRelateSqlListDateRange,
  updateRelateSqlSelectedRecord,
  updateExpandedRowKeys,
  updateSelectedRawSqlRecord,
  initModalStatus: initSqlInsightsModalStatus,
  updateModalStatus: updateSqlInsightsModalStatus
} = sqlInsights.actions;

export default sqlInsights.reducer;
