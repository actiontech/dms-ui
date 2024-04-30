import reducers, {
  updateSqlOptimizationIsSupported
} from '.';

import { IReduxState } from '..';

describe('store system', () => {
  const state: IReduxState['permission'] = {
    sqlOptimizationIsSupported: false
  };

  it('should update sql optimization is supported', () => {
    const newState = reducers(
      state,
      updateSqlOptimizationIsSupported({
        isSupported: true
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      sqlOptimizationIsSupported: true
    });
  });
});
