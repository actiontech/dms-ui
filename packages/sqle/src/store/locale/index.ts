import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { LocalStorageWrapper } from '@actiontech/shared';

type LocaleReduxState = {
  language: string;
};

const initialState: LocaleReduxState = {
  language: LocalStorageWrapper.getOrDefault(
    StorageKey.Language,
    SupportLanguage.zhCN
  )
};

const locale = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    updateLanguage: (
      state,
      { payload: { language } }: PayloadAction<{ language: SupportLanguage }>
    ) => {
      state.language = language;
      LocalStorageWrapper.set(StorageKey.Language, language);
    }
  }
});

export const { updateLanguage } = locale.actions;

export default locale.reducer;
