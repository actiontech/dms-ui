import {
  StorageKey,
  LocalStorageWrapper,
  SupportLanguage,
  SupportTheme,
  SystemRole
} from '@actiontech/dms-kit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IUidWithName,
  IUserBindProject
} from '@actiontech/shared/lib/api/base/service/common';
import { DEFAULT_LANGUAGE } from '@actiontech/dms-kit';
import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type IBindProject = { archived?: boolean } & IUserBindProject;

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
  systemPreference?: GetUserSystemEnum;
};

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
  systemPreference: undefined
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
    updateSystemPreference: (
      state,
      {
        payload: { systemPreference }
      }: PayloadAction<{ systemPreference?: GetUserSystemEnum }>
    ) => {
      state.systemPreference = systemPreference;
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
  updateSystemPreference
} = user.actions;

export default user.reducer;
