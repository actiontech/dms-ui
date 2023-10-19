import { SupportLanguage } from '@actiontech/shared/lib/enum';
import reducers, { updateLanguage } from '.';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { LocalStorageWrapper } from '@actiontech/shared';

describe('store/locale', () => {
  test('should create action', () => {
    expect(updateLanguage({ language: SupportLanguage.enUS })).toEqual({
      payload: {
        language: 'en-US'
      },
      type: 'locale/updateLanguage'
    });
  });

  test('should update language when dispatch updateLanguage action', () => {
    const localStorageWrapperSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const state = { language: SupportLanguage.zhCN };
    const newState = reducers(
      state,
      updateLanguage({ language: SupportLanguage.enUS })
    );
    expect(newState.language).toBe(SupportLanguage.enUS);
    expect(localStorageWrapperSpy).toBeCalledTimes(1);
    expect(localStorageWrapperSpy).toBeCalledWith(
      StorageKey.Language,
      SupportLanguage.enUS
    );
  });
});
