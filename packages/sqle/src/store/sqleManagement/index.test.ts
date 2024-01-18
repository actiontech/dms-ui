import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import reducers, {
  SqleManagementState,
  updateSqlIdList,
  updateSqleManagement
} from '.';

const initialState: SqleManagementState = {
  modalStatus: {},
  selectSqleManagement: null,
  selectSqlIdList: null
};

describe('store/sqleManagement', () => {
  test('should create action', () => {
    expect(updateSqleManagement(null)).toEqual({
      payload: null,
      type: 'sqleManagement/updateSqleManagement'
    });
  });

  test('should exc updateSqleManagement', () => {
    const state = {
      id: 1,
      status: SqlManageStatusEnum.manual_audited
    };
    const newState = reducers(initialState, updateSqleManagement(state));
    expect(newState.selectSqleManagement).toEqual(state);
  });

  test('should exc updateSqlIdList', () => {
    const state = [
      {
        id: 1
      },
      {
        id: 2
      }
    ];
    const newState = reducers(initialState, updateSqlIdList(state));
    expect(newState.selectSqlIdList).toEqual(state);
  });
});
