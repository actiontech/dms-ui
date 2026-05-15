import reducers, {
  updateModuleFeatureSupport,
  updateUserOperationPermissions
} from '.';

import { IReduxState } from '..';

describe('store system', () => {
  const state: IReduxState['permission'] = {
    moduleFeatureSupport: { sqlOptimization: false, knowledge: false },
    userOperationPermissions: null
  };

  it('should update module feature support state', () => {
    const newState = reducers(
      state,
      updateModuleFeatureSupport({
        sqlOptimization: true,
        knowledge: true
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      moduleFeatureSupport: { sqlOptimization: true, knowledge: true },
      userOperationPermissions: null
    });
  });

  it('should update user operation permission data', () => {
    const newState = reducers(
      state,
      updateUserOperationPermissions({ is_admin: false })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      moduleFeatureSupport: { sqlOptimization: false, knowledge: false },
      userOperationPermissions: { is_admin: false }
    });
  });
});
