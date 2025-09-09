import reducers, {
  updateResultDrawerData,
  initSqlAnalyzeModalStatus,
  updateSqlAnalyzeModalStatus
} from '.';
import { IReduxState } from '..';

describe('store/sqlAnalyze', () => {
  const state: IReduxState['sqlAnalyze'] = {
    modalStatus: {},
    resultDrawer: {
      currentResultDrawerData: null
    }
  };

  describe('action creators', () => {
    test('should create updateResultDrawerData action', () => {
      const resultDrawerData = { optimizationId: 'test-id-123' };
      expect(
        updateResultDrawerData({
          resultDrawerData
        })
      ).toEqual({
        payload: {
          resultDrawerData
        },
        type: 'sqlAnalyze/updateResultDrawerData'
      });
    });

    test('should create initSqlAnalyzeModalStatus action', () => {
      const modalStatus = { testModal: true };
      expect(
        initSqlAnalyzeModalStatus({
          modalStatus
        })
      ).toEqual({
        payload: {
          modalStatus
        },
        type: 'sqlAnalyze/initModalStatus'
      });
    });

    test('should create updateSqlAnalyzeModalStatus action', () => {
      expect(
        updateSqlAnalyzeModalStatus({
          modalName: 'testModal',
          status: false
        })
      ).toEqual({
        payload: {
          modalName: 'testModal',
          status: false
        },
        type: 'sqlAnalyze/updateModalStatus'
      });
    });
  });

  describe('reducer logic', () => {
    test('should update resultDrawer data when dispatch updateResultDrawerData action', () => {
      const resultDrawerData = { optimizationId: 'test-optimization-id' };
      const newState = reducers(
        state,
        updateResultDrawerData({
          resultDrawerData
        })
      );
      expect(newState).not.toBe(state);
      expect(newState).toEqual({
        modalStatus: {},
        resultDrawer: {
          currentResultDrawerData: resultDrawerData
        }
      });
    });

    test('should initialize modal status when dispatch initSqlAnalyzeModalStatus action', () => {
      const modalStatus = { modal1: true, modal2: false };
      const newState = reducers(
        state,
        initSqlAnalyzeModalStatus({
          modalStatus
        })
      );
      expect(newState).not.toBe(state);
      expect(newState).toEqual({
        modalStatus: modalStatus,
        resultDrawer: {
          currentResultDrawerData: null
        }
      });
    });

    test('should update specific modal status when dispatch updateSqlAnalyzeModalStatus action', () => {
      const stateWithModalStatus: IReduxState['sqlAnalyze'] = {
        modalStatus: { modal1: false, modal2: true },
        resultDrawer: {
          currentResultDrawerData: null
        }
      };

      const newState = reducers(
        stateWithModalStatus,
        updateSqlAnalyzeModalStatus({
          modalName: 'modal1',
          status: true
        })
      );
      expect(newState).not.toBe(stateWithModalStatus);
      expect(newState).toEqual({
        modalStatus: { modal1: true, modal2: true },
        resultDrawer: {
          currentResultDrawerData: null
        }
      });
    });
  });

  describe('initial state', () => {
    test('should have correct initial state', () => {
      const initialState = reducers(undefined, { type: '@@INIT' });
      expect(initialState).toEqual({
        modalStatus: {},
        resultDrawer: {
          currentResultDrawerData: null
        }
      });
    });
  });
});
