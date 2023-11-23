import { LocalStorageWrapper } from '@actiontech/shared';
import { StorageKey, SupportTheme } from '@actiontech/shared/lib/enum';
import { atom, selector } from 'recoil';
import { recoilIsInstanceOfDefaultValue, StoreKey } from '~/store';

const GlobalTokenState = atom({
  key: StoreKey.Global_Token,
  default: LocalStorageWrapper.getOrDefault(StorageKey.Token, '')
});

export const GlobalToken = selector({
  key: StoreKey.Global_Token_Selector,
  get: ({ get }) => get(GlobalTokenState),
  set: ({ set }, newToken) => {
    if (recoilIsInstanceOfDefaultValue(newToken)) {
      return;
    }
    LocalStorageWrapper.set(StorageKey.Token, newToken as any);
    set(GlobalTokenState as any, newToken);
  }
});

export const GlobalUserName = atom({
  key: StoreKey.Global_Username,
  default: ''
});

export const GlobalTheme = atom({
  key: StoreKey.Global_Theme,
  default: SupportTheme.LIGHT
});
