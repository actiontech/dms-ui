import { LocalStorageWrapper } from '@actiontech/shared';
import { IViewScope } from '../../api/common';
import { StorageKey, SupportTheme } from '@actiontech/shared/lib/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserReduxState = {
  username: string;
  userId: number | null;
  roleId: number | null;
  token: string;
  theme: SupportTheme;
  userScope: IViewScope[];
};

const initialState: UserReduxState = {
  username: '',
  userId: null,
  roleId: null,
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(
    StorageKey.Theme,
    SupportTheme.LIGHT
  ) as SupportTheme,
  userScope: []
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (
      state,
      {
        payload: { username, userId, roleId }
      }: PayloadAction<{
        username: string;
        userId: number | null;
        roleId: number | null;
      }>
    ) => {
      state.username = username;
      state.userId = userId;
      state.roleId = roleId;
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
    updateUserScope: (
      state,
      { payload: { userScope } }: PayloadAction<{ userScope: IViewScope[] }>
    ) => {
      state.userScope = userScope;
    }
  }
});

export const { updateUser, updateTheme, updateToken, updateUserScope } =
  user.actions;

export default user.reducer;
