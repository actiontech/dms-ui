import zhLocale from './locales/zh';
import enLocale from './locales/en';
import frLocale from './locales/fr';
import itLocale from './locales/it';
import ruLocale from './locales/ru';
import viLocale from './locales/vi';
import type { LocaleResources } from './types';

export const resources: LocaleResources = {
  zh: zhLocale,
  en: enLocale,
  fr: frLocale,
  it: itLocale,
  ru: ruLocale,
  vi: viLocale
};

// 导出类型
export type {
  LocaleResource,
  SupportedLanguage,
  LocaleResources,
  TranslationParams,
  TranslateFunction,
  LocalizationContextType,
  LocalizationProviderProps
} from './types';

// 导出 Context 和 Provider
export { LocalizationContext, LocalizationProvider } from './context';

// 导出 hooks
export {
  useTranslation,
  useCurrentLanguage,
  useChangeLanguage,
  useT
} from './hooks';

// 导出工具函数
export {
  transformLocaleResource,
  translateWithParams,
  getStoredLanguage,
  setStoredLanguage,
  mergeLocaleResources
} from './utils';
