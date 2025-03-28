import reducers, {
  updateToken,
  updateTheme,
  updateUser,
  updateUserUid,
  updateUserInfoFetchStatus,
  updateBindProjects,
  updateManagementPermissions,
  updateLanguage
} from '.';
import { IReduxState } from '..';
import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  SupportLanguage,
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
    isUserInfoFetched: false,
    language: SupportLanguage.zhCN
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
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      isUserInfoFetched: false
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
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      isUserInfoFetched: false
    });
  });

  it('should update language when dispatch updateLanguage action', () => {
    const newState = reducers(
      state,
      updateLanguage({
        language: SupportLanguage.enUS,
        store: true
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: '',
      theme: SupportTheme.LIGHT,
      language: SupportLanguage.enUS,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      isUserInfoFetched: false
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
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: [],
      role: SystemRole.admin,
      isUserInfoFetched: false
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
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      isUserInfoFetched: false
    });
  });

  it('should update user isUserInfoFetched when dispatch updateUserInfoFetchStatus action', () => {
    const newState = reducers(state, updateUserInfoFetchStatus(true));
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: '',
      theme: SupportTheme.LIGHT,
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: [],
      role: '',
      isUserInfoFetched: true
    });
  });

  it('should update user bind project when dispatch updateBindProjects action', () => {
    const mockBindProjects = [
      {
        is_manager: true,
        project_name: 'default',
        project_id: 'project_id',
        archived: false
      }
    ];
    const newState = reducers(
      state,
      updateBindProjects({
        bindProjects: mockBindProjects
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: '',
      theme: SupportTheme.LIGHT,
      language: SupportLanguage.zhCN,
      bindProjects: mockBindProjects,
      managementPermissions: [],
      role: '',
      isUserInfoFetched: false
    });
  });

  it('should update user ManagementPermissions when dispatch updateManagementPermissions action', () => {
    const mockManagementPermissions = [{ name: 'default', uid: 'uid' }];
    const newState = reducers(
      state,
      updateManagementPermissions({
        managementPermissions: mockManagementPermissions
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      username: '',
      uid: '',
      token: '',
      theme: SupportTheme.LIGHT,
      language: SupportLanguage.zhCN,
      bindProjects: [],
      managementPermissions: mockManagementPermissions,
      role: '',
      isUserInfoFetched: false
    });
  });
});
