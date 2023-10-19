import reducers, {
  updateToken,
  updateTheme,
  updateUser,
  updateUserUid
} from '.';
import { IReduxState } from '..';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  SupportTheme,
  SystemRole
} from '@actiontech/shared/lib/enum';

describe('store user', () => {
  const state: IReduxState['user'] = {
    username: '',
    uid: LocalStorageWrapper.getOrDefault(StorageKey.USER_UID, ''),
    token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
    theme: LocalStorageWrapper.getOrDefault(
      StorageKey.Theme,
      SupportTheme.LIGHT
    ) as SupportTheme,
    bindProjects: [],
    managementPermissions: [],
    role: '',
    useInfoFetched: false
  };

  it('should update token when dispatch updateToken action', () => {
    const newState = reducers(
      state,
      updateToken({
        token: 'abcd1234'
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: 'abcd1234',
      theme: SupportTheme.LIGHT,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      projectID: ''
    });
  });

  it('should update theme when dispatch updateTheme action', () => {
    const newState = reducers(
      state,
      updateTheme({
        theme: SupportTheme.DARK
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: '',
      theme: SupportTheme.DARK,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      projectID: ''
    });
  });

  it('should update username when dispatch updateUsername action', () => {
    const newState = reducers(
      state,
      updateUser({
        username: 'testUser1',
        role: SystemRole.admin
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: 'testUser1',
      uid: '',
      token: '',
      theme: SupportTheme.LIGHT,
      bindProjects: [],
      managementPermissions: [],
      role: SystemRole.admin,
      projectID: ''
    });
  });

  it('should update user uid when dispatch updateUserUid action', () => {
    const newState = reducers(
      state,
      updateUserUid({
        uid: '100234'
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '100234',
      token: '',
      theme: SupportTheme.LIGHT,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      projectID: ''
    });
  });
});
