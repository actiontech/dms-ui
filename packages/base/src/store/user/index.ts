import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  SupportLanguage,
  SupportTheme,
  SystemRole
} from '@actiontech/shared/lib/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IUidWithName,
  IUserBindProject
} from '@actiontech/shared/lib/api/base/service/common';
import { DEFAULT_LANGUAGE } from '@actiontech/shared/lib/locale';

export type IBindProject = { archived?: boolean } & IUserBindProject;

type PasswordSecurity = {
  passwordExpired: boolean;
  passwordExpiryDays: number;
};

type UserReduxState = {
  username: string;
  role: SystemRole | '';
  token: string;
  theme: SupportTheme;
  bindProjects: Array<IBindProject>;
  managementPermissions: IUidWithName[];
  uid: string;
  isUserInfoFetched: boolean;
  language: SupportLanguage;
  isFirstLogin: boolean;
} & PasswordSecurity;

const localStoragePasswordSecurity: PasswordSecurity = (() => {
  try {
    const localString = LocalStorageWrapper.get(
      StorageKey.PASSWORD_EXPIRED_INFO
    );
    if (localString) {
      return JSON.parse(localString);
    }
    return {
      passwordExpired: false,
      passwordExpiryDays: 0
    };
  } catch (error) {
    return {
      passwordExpired: false,
      passwordExpiryDays: 0
    };
  }
})();

const initialState: UserReduxState = {
  username: '',
  role: '',
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(
    StorageKey.Theme,
    SupportTheme.LIGHT
  ) as SupportTheme,
  bindProjects: [],
  managementPermissions: [],
  uid: LocalStorageWrapper.getOrDefault(StorageKey.USER_UID, ''),
  isUserInfoFetched: false,
  language: LocalStorageWrapper.getOrDefault(
    StorageKey.Language,
    DEFAULT_LANGUAGE
  ) as SupportLanguage,
  isFirstLogin:
    LocalStorageWrapper.get(StorageKey.IS_FIRST_LOGIN) === String(true),
  ...localStoragePasswordSecurity
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (
      state,
      {
        payload: { username, role }
      }: PayloadAction<{ username: string; role: SystemRole | '' }>
    ) => {
      state.username = username;
      state.role = role;
    },
    updateTheme: (
      state,
      { payload: { theme } }: PayloadAction<{ theme: SupportTheme }>
    ) => {
      state.theme = theme;
      LocalStorageWrapper.set(StorageKey.Theme, theme);
    },
    updateLanguage: (
      state,
      {
        payload: { language, store }
      }: PayloadAction<{ language: SupportLanguage; store: boolean }>
    ) => {
      state.language = language;
      if (store) {
        LocalStorageWrapper.set(StorageKey.Language, language);
      }
    },
    updateToken: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.token = token;
      LocalStorageWrapper.set(StorageKey.Token, token);
    },
    updateBindProjects: (
      state,
      {
        payload: { bindProjects }
      }: PayloadAction<{ bindProjects: IBindProject[] }>
    ) => {
      state.bindProjects = bindProjects;
    },
    updateManagementPermissions: (
      state,
      {
        payload: { managementPermissions }
      }: PayloadAction<{ managementPermissions: IUidWithName[] }>
    ) => {
      state.managementPermissions = managementPermissions;
    },
    updateUserUid: (
      state,
      { payload: { uid } }: PayloadAction<{ uid: string }>
    ) => {
      state.uid = uid;
      LocalStorageWrapper.set(StorageKey.USER_UID, uid);
    },
    updateUserInfoFetchStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isUserInfoFetched = payload;
    },
    updateIsFirstLogin: (state, { payload }: PayloadAction<boolean>) => {
      state.isFirstLogin = payload;
      LocalStorageWrapper.set(StorageKey.IS_FIRST_LOGIN, String(payload));
    },
    updatePasswordSecurity: (
      state,
      {
        payload: { passwordSecurity }
      }: PayloadAction<{ passwordSecurity: PasswordSecurity }>
    ) => {
      state.passwordExpired = passwordSecurity.passwordExpired;
      state.passwordExpiryDays = passwordSecurity.passwordExpiryDays;
      LocalStorageWrapper.set(
        StorageKey.PASSWORD_EXPIRED_INFO,
        JSON.stringify(passwordSecurity)
      );
    }
  }
});

export const {
  updateUser,
  updateTheme,
  updateLanguage,
  updateToken,
  updateBindProjects,
  updateManagementPermissions,
  updateUserUid,
  updateUserInfoFetchStatus,
  updateIsFirstLogin,
  updatePasswordSecurity
} = user.actions;

export default user.reducer;
