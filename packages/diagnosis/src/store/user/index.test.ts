import LocalStorageWrapper from '@actiontech/shared/lib/utils/LocalStorageWrapper';
import user, { updateUser, updateTheme, updateToken, updateUserScope } from '.';
import { StorageKey, SupportTheme } from '@actiontech/shared/lib/enum';

const initStore = {
  username: '',
  userId: LocalStorageWrapper.getOrDefault(StorageKey.DIAGNOSIS_USER_ID, ''),
  roleId: null,
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(
    StorageKey.Theme,
    SupportTheme.LIGHT
  ) as SupportTheme,
  userScope: []
};

describe('store/user', () => {
  test('should create action', () => {
    expect(updateUser({ username: '', userId: '', roleId: '' })).toEqual({
      payload: {
        username: '',
        userId: '',
        roleId: ''
      },
      type: 'user/updateUser'
    });
    expect(updateTheme({ theme: SupportTheme.LIGHT })).toEqual({
      payload: {
        theme: SupportTheme.LIGHT
      },
      type: 'user/updateTheme'
    });
    expect(updateToken({ token: '' })).toEqual({
      payload: { token: '' },
      type: 'user/updateToken'
    });
    expect(updateUserScope({ userScope: [] })).toEqual({
      payload: { userScope: [] },
      type: 'user/updateUserScope'
    });
  });

  test('should update user info', async () => {
    const store = { ...initStore };
    const newStore = user(
      store,
      updateUser({ username: 'admin', userId: '1', roleId: '2' })
    );
    expect(newStore).not.toBe(store);
    expect(newStore.username).toEqual('admin');
    expect(newStore.userId).toEqual('1');
    expect(newStore.roleId).toEqual('2');
  });
  test('should update theme', () => {
    const store = { ...initStore };
    const newStore = user(store, updateTheme({ theme: SupportTheme.DARK }));
    expect(newStore).not.toBe(store);
    expect(newStore.theme).toEqual(SupportTheme.DARK);
  });
  test('should update token', () => {
    const store = { ...initStore };
    const newStore = user(store, updateToken({ token: '123456' }));
    expect(newStore).not.toBe(store);
    expect(newStore.token).toEqual('123456');
  });
  test('should update user scope', () => {
    const store = { ...initStore };
    const newStore = user(store, updateUserScope({ userScope: [] }));
    expect(newStore).not.toBe(store);
    expect(newStore.userScope).toEqual([]);
  });
});
