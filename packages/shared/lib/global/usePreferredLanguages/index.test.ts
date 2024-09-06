import usePreferredLanguages from './';
import { renderHook, cleanup } from '@testing-library/react-hooks';
import { SupportLanguage } from '../../enum';
import antd_zh_CN from 'antd/locale/zh_CN';
import antd_en_US from 'antd/locale/en_US';

describe('usePreferredLanguages', () => {
  let languageGetter: jest.SpyInstance;
  let languagesGetter: jest.SpyInstance;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'language', 'get');
    languagesGetter = jest.spyOn(window.navigator, 'languages', 'get');
  });

  afterEach(() => {
    cleanup();
  });

  it('render init preferred language', async () => {
    const { result } = renderHook(() => usePreferredLanguages());
    expect(result.current.currentLanguage).toBe(SupportLanguage.enUS);
    expect(result.current.preferredEnUS).toBeTruthy();
    expect(result.current.preferredZhCN).toBeFalsy();
    expect(result.current.antdLanguage).toBe(antd_en_US);
  });

  it('render preferred language is zhCN', async () => {
    languagesGetter.mockReturnValue([]);
    languageGetter.mockReturnValue('zh_CN');
    const { result } = renderHook(() => usePreferredLanguages());
    expect(result.current.currentLanguage).toBe(SupportLanguage.zhCN);
    expect(result.current.preferredEnUS).toBeFalsy();
    expect(result.current.preferredZhCN).toBeTruthy();
    expect(result.current.antdLanguage).toBe(antd_zh_CN);
  });
});
