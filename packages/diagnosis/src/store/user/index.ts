import { LocalStorageWrapper } from '@actiontech/shared';
import {
  StorageKey,
  SupportTheme,
  SystemRole
} from '@actiontech/shared/lib/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserReduxState = {
  username: string;
  role: SystemRole | '';
  token: string;
  theme: SupportTheme;
};

const initialState: UserReduxState = {
  username: '',
  role: '',
  token: LocalStorageWrapper.getOrDefault(StorageKey.Token, ''),
  theme: LocalStorageWrapper.getOrDefault(
    StorageKey.Theme,
    SupportTheme.LIGHT
  ) as SupportTheme
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
    }
  }
});

export const { updateUser, updateTheme, updateToken } = user.actions;

export default user.reducer;
