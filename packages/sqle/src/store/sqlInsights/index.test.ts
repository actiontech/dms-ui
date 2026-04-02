import reducers, {
  updateRelateSqlListDateRange,
  updateRelateSqlSelectedRecord,
  updateExpandedRowKeys,
  updateSelectedRawSqlRecord,
  initSqlInsightsModalStatus,
  updateSqlInsightsModalStatus
} from '.';
import dayjs, { Dayjs } from 'dayjs';
import {
  IRelatedSQLInfo,
  IRawSQLRecord
} from '@actiontech/shared/lib/api/sqle/service/common';

describe('store/sqlInsights', () => {
  test('should create action', () => {
    const dateRange: [Dayjs, Dayjs] = [
      dayjs('2023-01-01'),
      dayjs('2023-01-31')
    ];
    expect(updateRelateSqlListDateRange({ dateRange })).toEqual({
      type: 'sqlInsights/updateRelateSqlListDateRange',
      payload: { dateRange }
    });

    expect(updateRelateSqlListDateRange({ dateRange: null })).toEqual({
      type: 'sqlInsights/updateRelateSqlListDateRange',
      payload: { dateRange: null }
    });

    const record: IRelatedSQLInfo = {
      sql_fingerprint: 'SELECT * FROM users WHERE id = ?',
      execute_time_avg: 0.05,
      execute_time_max: 0.1,
      execute_time_min: 0.01
    };
    expect(updateRelateSqlSelectedRecord({ record })).toEqual({
      type: 'sqlInsights/updateRelateSqlSelectedRecord',
      payload: { record }
    });

    expect(updateRelateSqlSelectedRecord({ record: null })).toEqual({
      type: 'sqlInsights/updateRelateSqlSelectedRecord',
      payload: { record: null }
    });

    const modalStatus = { testModal: true };
    expect(initSqlInsightsModalStatus({ modalStatus })).toEqual({
      type: 'sqlInsights/initModalStatus',
      payload: { modalStatus }
    });

    expect(
      updateSqlInsightsModalStatus({
        modalName: 'testModal',
        status: false
      })
    ).toEqual({
      type: 'sqlInsights/updateModalStatus',
      payload: { modalName: 'testModal', status: false }
    });

    const keys = ['key1', 'key2'];
    expect(updateExpandedRowKeys({ keys })).toEqual({
      type: 'sqlInsights/updateExpandedRowKeys',
      payload: { keys }
    });

    const rawSqlRecord: IRawSQLRecord = {
      id: 1,
      sql_text: 'SELECT * FROM users WHERE id = 1',
      execute_time: 0.05,
      lock_wait_time: 0,
      execute_at: '2023-01-01T00:00:00Z',
      is_in_transaction: false,
      sql_manage_id: 100,
      source: 'sql_manage'
    };
    expect(updateSelectedRawSqlRecord({ record: rawSqlRecord })).toEqual({
      type: 'sqlInsights/updateSelectedRawSqlRecord',
      payload: { record: rawSqlRecord }
    });

    expect(updateSelectedRawSqlRecord({ record: null })).toEqual({
      type: 'sqlInsights/updateSelectedRawSqlRecord',
      payload: { record: null }
    });
  });

  const state = {
    modalStatus: {},
    relateSqlList: {
      selectedDateRange: null,
      selectedRecord: null,
      expandedRowKeys: [] as string[],
      selectedRawSqlRecord: null
    }
  };

  test('should update selectedDateRange when dispatch updateRelateSqlListDateRange action', () => {
    const dateRange: [Dayjs, Dayjs] = [
      dayjs('2023-01-01'),
      dayjs('2023-01-31')
    ];
    const newState = reducers(
      state,
      updateRelateSqlListDateRange({ dateRange })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      relateSqlList: {
        selectedDateRange: dateRange,
        selectedRecord: null,
        expandedRowKeys: [],
        selectedRawSqlRecord: null
      }
    });
  });

  test('should update selectedRecord when dispatch updateRelateSqlSelectedRecord action', () => {
    const record: IRelatedSQLInfo = {
      sql_fingerprint: 'SELECT * FROM orders WHERE status = ?',
      execute_time_avg: 0.08,
      execute_time_max: 0.15,
      execute_time_min: 0.02
    };
    const newState = reducers(state, updateRelateSqlSelectedRecord({ record }));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: record,
        expandedRowKeys: [],
        selectedRawSqlRecord: null
      }
    });
  });

  test('should initialize modal status when dispatch initSqlInsightsModalStatus action', () => {
    const modalStatus = { testModal: true, anotherModal: false };
    const newState = reducers(
      state,
      initSqlInsightsModalStatus({ modalStatus })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: modalStatus,
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null,
        expandedRowKeys: [],
        selectedRawSqlRecord: null
      }
    });
  });

  test('should update modal status when dispatch updateSqlInsightsModalStatus action', () => {
    const stateWithModal = {
      modalStatus: { testModal: false },
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null,
        expandedRowKeys: [] as string[],
        selectedRawSqlRecord: null
      }
    };
    const newState = reducers(
      stateWithModal,
      updateSqlInsightsModalStatus({
        modalName: 'testModal',
        status: true
      })
    );
    expect(newState).not.toBe(stateWithModal);
    expect(newState).toEqual({
      modalStatus: { testModal: true },
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null,
        expandedRowKeys: [],
        selectedRawSqlRecord: null
      }
    });
  });

  test('should update expandedRowKeys when dispatch updateExpandedRowKeys action', () => {
    const keys = ['fingerprint_1', 'fingerprint_2'];
    const newState = reducers(state, updateExpandedRowKeys({ keys }));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null,
        expandedRowKeys: keys,
        selectedRawSqlRecord: null
      }
    });
  });

  test('should clear expandedRowKeys when dispatch with empty array', () => {
    const stateWithExpanded = {
      ...state,
      relateSqlList: {
        ...state.relateSqlList,
        expandedRowKeys: ['key1', 'key2']
      }
    };
    const newState = reducers(
      stateWithExpanded,
      updateExpandedRowKeys({ keys: [] })
    );
    expect(newState.relateSqlList.expandedRowKeys).toEqual([]);
  });

  test('should update selectedRawSqlRecord when dispatch updateSelectedRawSqlRecord action', () => {
    const rawSqlRecord: IRawSQLRecord = {
      id: 1,
      sql_text: 'SELECT * FROM users WHERE id = 1',
      execute_time: 0.05,
      lock_wait_time: 0.01,
      execute_at: '2023-01-01T10:00:00Z',
      is_in_transaction: true,
      sql_manage_id: 100,
      source: 'sql_manage'
    };
    const newState = reducers(
      state,
      updateSelectedRawSqlRecord({ record: rawSqlRecord })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null,
        expandedRowKeys: [],
        selectedRawSqlRecord: rawSqlRecord
      }
    });
  });

  test('should clear selectedRawSqlRecord when dispatch with null', () => {
    const stateWithRecord = {
      ...state,
      relateSqlList: {
        ...state.relateSqlList,
        selectedRawSqlRecord: {
          id: 1,
          sql_text: 'SELECT 1',
          execute_time: 0.01
        }
      }
    };
    const newState = reducers(
      stateWithRecord,
      updateSelectedRawSqlRecord({ record: null })
    );
    expect(newState.relateSqlList.selectedRawSqlRecord).toBeNull();
  });
});
