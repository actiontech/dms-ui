import reducers, { updateSelectSqlManagementException } from '.';
import { IReduxState } from '..';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('store/sqlManagementException', () => {
  test('should create action', () => {
    expect(
      updateSelectSqlManagementException({
        selectRow: {
          blacklist_id: 2,
          desc: 'desc',
          type: BlacklistResV1TypeEnum.sql,
          content: 'select a from b'
        }
      })
    ).toEqual({
      payload: {
        selectRow: {
          blacklist_id: 2,
          desc: 'desc',
          type: BlacklistResV1TypeEnum.sql,
          content: 'select a from b'
        }
      },
      type: 'sqlManagementException/updateSelectSqlManagementException'
    });
  });

  const state: IReduxState['sqlManagementException'] = {
    selectSqlManagementExceptionRecord: null,
    modalStatus: {}
  };

  test('should update selectSqlManagementExceptionRecord when dispatch updateSelectSqlManagementException action', () => {
    const newState = reducers(
      state,
      updateSelectSqlManagementException({
        selectRow: {
          blacklist_id: 2,
          desc: 'desc',
          type: BlacklistResV1TypeEnum.sql,
          content: 'select a from b'
        }
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectSqlManagementExceptionRecord: {
        blacklist_id: 2,
        desc: 'desc',
        type: BlacklistResV1TypeEnum.sql,
        content: 'select a from b'
      },
      modalStatus: {}
    });
  });
});
