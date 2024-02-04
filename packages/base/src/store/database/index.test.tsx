import { IReduxState } from '..';
import reducers, { updateDriverMeta } from '.';

describe('store/database', () => {
  const state: IReduxState['database'] = {
    driverMeta: []
  };

  it('should update driver meta', () => {
    const newState = reducers(
      state,
      updateDriverMeta([
        {
          db_type: 'mysql',
          logo_path: 'custom-logo-path',
          params: []
        }
      ])
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      driverMeta: [
        {
          db_type: 'mysql',
          logo_path: 'custom-logo-path',
          params: []
        }
      ]
    });
  });
});
