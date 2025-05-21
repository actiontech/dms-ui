import { IReduxState } from '..';
import reducers, { updateCBSqlOperationRecord } from '.';
import { listCBOperationLogsMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver/data';

describe('store/cloudBeaver', () => {
  const state: IReduxState['cloudBeaver'] = {
    modalStatus: {},
    cloudBeaverSqlOperationRecord: null
  };

  it('should execute updateCBSqlOperationRecord', () => {
    const newState = reducers(
      state,
      updateCBSqlOperationRecord({
        cbSqlOperationRecord: listCBOperationLogsMockData[0]
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      cloudBeaverSqlOperationRecord: listCBOperationLogsMockData[0]
    });
  });
});
