import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  SupportTheme,
  SystemRole
} from '@actiontech/shared/lib/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IManagementPermissionResV1 } from '@actiontech/shared/lib/types/common.type';
import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

type UserReduxState = {
  username: string;
  role: SystemRole | '';
  token: string;
  theme: SupportTheme;
  bindProjects: Array<IUserBindProject>;
  managementPermissions: IManagementPermissionResV1[];
  uid: string;
  useInfoFetched: boolean;
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
  useInfoFetched: false
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
      }: PayloadAction<{ bindProjects: IUserBindProject[] }>
    ) => {
      state.bindProjects = bindProjects;
    },
    updateManagementPermissions: (
      state,
      {
        payload: { managementPermissions }
      }: PayloadAction<{ managementPermissions: IManagementPermissionResV1[] }>
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
      state.useInfoFetched = payload;
    }
  }
});

export const {
  updateUser,
  updateTheme,
  updateToken,
  updateBindProjects,
  updateManagementPermissions,
  updateUserUid,
  updateUserInfoFetchStatus
} = user.actions;

export default user.reducer;
