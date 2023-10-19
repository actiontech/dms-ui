import reducers, { updateUserType } from '.';

describe('store/home', () => {
  it('should create action', () => {
    expect(updateUserType({ userType: 'admin' })).toEqual({
      payload: {
        userType: 'admin'
      },
      type: 'home/updateUserType'
    });
  });

  it('should update userType when dispatch updateUserType action', () => {
    const state = { userType: 'admin' };
    const newState = reducers(state, updateUserType({ userType: 'normal' }));
    expect(newState.userType).toBe('normal');
  });
});
