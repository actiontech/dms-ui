import reducers, { refreshProjectOverview } from '.';
import { IReduxState } from '..';

describe('store/projectManage', () => {
  test('should create action', () => {
    expect(refreshProjectOverview()).toEqual({
      type: 'projectManage/refreshProjectOverview'
    });
  });

  const state: IReduxState['projectManage'] = {
    overviewRefreshFlag: false
  };

  test('should update overviewRefreshFlag when dispatch refreshProjectOverview action', () => {
    const newState = reducers(state, refreshProjectOverview());
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      overviewRefreshFlag: true
    });
  });
});
