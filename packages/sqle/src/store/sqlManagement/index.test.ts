import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import reducers, {
  SqlManagementState,
  setSqlManagementBatchSelectData,
  setSqlManagementSelectData
} from '.';

const initialState: SqlManagementState = {
  modalStatus: {},
  selectSqlManagement: null,
  batchSelectSqlManagement: null
};

describe('store/sqlManagement', () => {
  test('should create action', () => {
    expect(setSqlManagementSelectData(null)).toEqual({
      payload: null,
      type: 'sqlManagement/setSqlManagementSelectData'
    });
  });

  test('should exc setSqlManagementSelectData', () => {
    const state = {
      id: 1,
      status: SqlManageStatusEnum.manual_audited
    };
    const newState = reducers(initialState, setSqlManagementSelectData(state));
    expect(newState.selectSqlManagement).toEqual(state);
  });

  test('should exc setSqlManagementBatchSelectData', () => {
    const state = [
      {
        id: 1
      },
      {
        id: 2
      }
    ];
    const newState = reducers(
      initialState,
      setSqlManagementBatchSelectData(state)
    );
    expect(newState.batchSelectSqlManagement).toEqual(state);
  });
});
