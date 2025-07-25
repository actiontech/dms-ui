import reducers, {
  updateRelateSqlListDateRange,
  updateRelateSqlSelectedRecord,
  initSqlInsightsModalStatus,
  updateSqlInsightsModalStatus
} from '.';
import dayjs, { Dayjs } from 'dayjs';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';

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
  });

  const state = {
    modalStatus: {},
    relateSqlList: {
      selectedDateRange: null,
      selectedRecord: null
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
        selectedRecord: null
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
        selectedRecord: record
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
        selectedRecord: null
      }
    });
  });

  test('should update modal status when dispatch updateSqlInsightsModalStatus action', () => {
    const stateWithModal = {
      modalStatus: { testModal: false },
      relateSqlList: {
        selectedDateRange: null,
        selectedRecord: null
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
        selectedRecord: null
      }
    });
  });
});
