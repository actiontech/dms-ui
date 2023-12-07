import useCurrentUser from '.';
import { renderHooksWithReduxAndRouter } from '../../testUtils/customRender';

describe('diagnosis/userCurrentUser', () => {
  it('get current user info', () => {
    const { result } = renderHooksWithReduxAndRouter(() => useCurrentUser(), {
      user: {
        username: 'admin',
        userId: '1',
        roleId: '10000',
        userScope: []
      }
    });

    expect(result.current.username).toBe('admin');
    expect(result.current.userId).toBe('1');
    expect(result.current.roleId).toBe('10000');
    expect(result.current.userScope).toStrictEqual([]);
  });
});
