import zhLocale from './locales/zh';
import enLocale from './locales/en';
import frLocale from './locales/fr';
import itLocale from './locales/it';
import ruLocale from './locales/ru';
import viLocale from './locales/vi';
import type { LocaleResources } from '@cloudbeaver/core-localization';

export * from './useObjectRef';
export * from './useObservableRef';
export * from './DisplayError/DisplayError';
export * from './AppRefreshButton/AppRefreshButton';
export * from './Snackbars/NotificationMark';
export * from './Loader/Loader';
export * from './Loader/LoaderContext';
export * from './Loader/useAutoLoad';

export const coreBlocksLocaleResources: LocaleResources = {
  zh: zhLocale,
  en: enLocale,
  fr: frLocale,
  it: itLocale,
  ru: ruLocale,
  vi: viLocale
};
