import reducers, {
  updateDiffModalData,
  updateTableStructureModalData,
  updateOptimizationResultModalData,
  updateQueryPlanFlowModalData,
  updateQueryPlanDiffModalData,
  updateSubmitLoading,
  initSqlOptimizationModalStatus,
  updateSqlOptimizationModalStatus
} from '.';
import { IReduxState } from '..';
import {
  IQueryPlanNode,
  IOptimizeStep
} from '@actiontech/shared/lib/api/sqle/service/common';

describe('store/sqlOptimization', () => {
  const state: IReduxState['sqlOptimization'] = {
    modalStatus: {},
    submitLoading: false,
    diffModal: {
      currentDiffData: null
    },
    tableStructureModal: {
      currentTableData: null
    },
    optimizationResultModal: {
      currentResultData: null
    },
    queryPlanFlowModal: {
      currentQueryPlanData: null
    },
    queryPlanDiffModal: {
      currentQueryPlanDiffData: null
    }
  };

  describe('action creators', () => {
    test('should create updateDiffModalData action', () => {
      const diffData = {
        originalSql: 'SELECT * FROM users',
        optimizedSql: 'SELECT id, name FROM users'
      };
      expect(
        updateDiffModalData({
          diffData
        })
      ).toEqual({
        payload: {
          diffData
        },
        type: 'sqlOptimization/updateDiffModalData'
      });
    });

    test('should create updateTableStructureModalData action', () => {
      const tableData = {
        tableStructure: 'CREATE TABLE users (id INT, name VARCHAR(255))',
        recommendedIndexes: 'CREATE INDEX idx_name ON users(name)'
      };
      expect(
        updateTableStructureModalData({
          tableData
        })
      ).toEqual({
        payload: {
          tableData
        },
        type: 'sqlOptimization/updateTableStructureModalData'
      });
    });

    test('should create updateOptimizationResultModalData action', () => {
      const resultData: IOptimizeStep = {
        chat_id: '1',
        optimized_sql: 'SELECT * FROM users',
        rule_desc: 'Query explanation'
      };
      expect(
        updateOptimizationResultModalData({
          resultData
        })
      ).toEqual({
        payload: {
          resultData
        },
        type: 'sqlOptimization/updateOptimizationResultModalData'
      });
    });

    test('should create updateQueryPlanFlowModalData action', () => {
      const queryPlanData: IQueryPlanNode[] = [
        {
          operator: 'SELECT',
          summary: ['cost: 100', 'rows: 1000']
        }
      ];
      expect(
        updateQueryPlanFlowModalData({
          queryPlanData
        })
      ).toEqual({
        payload: {
          queryPlanData
        },
        type: 'sqlOptimization/updateQueryPlanFlowModalData'
      });
    });

    test('should create updateQueryPlanDiffModalData action', () => {
      const queryPlanDiffData = {
        originalQueryPlan: [
          {
            operator: 'SELECT',
            summary: ['cost: 100', 'rows: 1000']
          }
        ],
        optimizedQueryPlan: [
          {
            operator: 'SELECT',
            summary: ['cost: 50', 'rows: 1000']
          }
        ]
      };
      expect(
        updateQueryPlanDiffModalData({
          queryPlanDiffData
        })
      ).toEqual({
        payload: {
          queryPlanDiffData
        },
        type: 'sqlOptimization/updateQueryPlanDiffModalData'
      });
    });

    test('should create updateSubmitLoading action', () => {
      expect(
        updateSubmitLoading({
          loading: true
        })
      ).toEqual({
        payload: {
          loading: true
        },
        type: 'sqlOptimization/updateSubmitLoading'
      });
    });

    test('should create initSqlOptimizationModalStatus action', () => {
      const modalStatus = { testModal: true };
      expect(
        initSqlOptimizationModalStatus({
          modalStatus
        })
      ).toEqual({
        payload: {
          modalStatus
        },
        type: 'sqlOptimization/initModalStatus'
      });
    });

    test('should create updateSqlOptimizationModalStatus action', () => {
      expect(
        updateSqlOptimizationModalStatus({
          modalName: 'testModal',
          status: false
        })
      ).toEqual({
        payload: {
          modalName: 'testModal',
          status: false
        },
        type: 'sqlOptimization/updateModalStatus'
      });
    });
  });

  describe('reducer logic', () => {
    test('should update diff modal data when dispatch updateDiffModalData action', () => {
      const diffData = {
        originalSql: 'SELECT * FROM users',
        optimizedSql: 'SELECT id, name FROM users WHERE active = 1'
      };
      const newState = reducers(
        state,
        updateDiffModalData({
          diffData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.diffModal.currentDiffData).toEqual(diffData);
    });

    test('should update table structure modal data when dispatch updateTableStructureModalData action', () => {
      const tableData = {
        tableStructure:
          'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255))',
        recommendedIndexes:
          'CREATE INDEX idx_name ON users(name); CREATE INDEX idx_active ON users(active)'
      };
      const newState = reducers(
        state,
        updateTableStructureModalData({
          tableData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.tableStructureModal.currentTableData).toEqual(tableData);
    });

    test('should update optimization result modal data when dispatch updateOptimizationResultModalData action', () => {
      const resultData = {
        chat_id: '1',
        optimized_sql: 'SELECT id, name FROM users WHERE active = 1',
        rule_desc: 'Using index on active column',
        origin_sql: 'SELECT * FROM users'
      };
      const newState = reducers(
        state,
        updateOptimizationResultModalData({
          resultData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.optimizationResultModal.currentResultData).toEqual(
        resultData
      );
    });

    test('should update query plan flow modal data when dispatch updateQueryPlanFlowModalData action', () => {
      const queryPlanData: IQueryPlanNode[] = [
        {
          operator: 'Table Scan',
          summary: ['cost: 1000', 'rows: 10000']
        },
        {
          operator: 'Filter',
          summary: ['cost: 500', 'rows: 5000']
        }
      ];
      const newState = reducers(
        state,
        updateQueryPlanFlowModalData({
          queryPlanData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.queryPlanFlowModal.currentQueryPlanData).toEqual(
        queryPlanData
      );
    });

    test('should update query plan diff modal data when dispatch updateQueryPlanDiffModalData action', () => {
      const queryPlanDiffData = {
        originalQueryPlan: [
          {
            operator: 'Table Scan',
            summary: ['cost: 1000', 'rows: 10000']
          }
        ],
        optimizedQueryPlan: [
          {
            operator: 'Index Scan',
            summary: ['cost: 100', 'rows: 1000']
          }
        ]
      };
      const newState = reducers(
        state,
        updateQueryPlanDiffModalData({
          queryPlanDiffData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.queryPlanDiffModal.currentQueryPlanDiffData).toEqual(
        queryPlanDiffData
      );
    });

    test('should update submit loading when dispatch updateSubmitLoading action', () => {
      const newState = reducers(
        state,
        updateSubmitLoading({
          loading: true
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.submitLoading).toBe(true);

      const newState2 = reducers(
        newState,
        updateSubmitLoading({
          loading: false
        })
      );
      expect(newState2).not.toBe(newState);
      expect(newState2.submitLoading).toBe(false);
    });

    test('should initialize modal status when dispatch initSqlOptimizationModalStatus action', () => {
      const modalStatus = { modal1: true, modal2: false };
      const newState = reducers(
        state,
        initSqlOptimizationModalStatus({
          modalStatus
        })
      );
      expect(newState).not.toBe(state);
      expect(newState.modalStatus).toEqual(modalStatus);
    });

    test('should update specific modal status when dispatch updateSqlOptimizationModalStatus action', () => {
      const stateWithModalStatus: IReduxState['sqlOptimization'] = {
        ...state,
        modalStatus: { modal1: false, modal2: true }
      };

      const newState = reducers(
        stateWithModalStatus,
        updateSqlOptimizationModalStatus({
          modalName: 'modal1',
          status: true
        })
      );
      expect(newState).not.toBe(stateWithModalStatus);
      expect(newState.modalStatus).toEqual({ modal1: true, modal2: true });
    });
  });
});
