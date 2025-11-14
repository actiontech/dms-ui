import { StorageKey, SupportLanguage } from '@actiontech/dms-kit';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import sqleZhCN from 'sqle/src/locale/zh-CN';
import sqleEnUS from 'sqle/src/locale/en-US';
import commonZhCN from '@actiontech/dms-kit/es/locale/zh-CN';
import commonEnUS from '@actiontech/dms-kit/es/locale/en-US';
import zhCN from './zh-CN';
import enUS from './en-US';
import { TOptions } from 'i18next';
import { LocalStorageWrapper } from '@actiontech/dms-kit';
import { TemplateKeyPath } from '@actiontech/dms-kit/es/types/common.type';
import { DEFAULT_LANGUAGE } from '@actiontech/dms-kit/es/locale';
import { findDuplicateKeys } from '@actiontech/dms-kit';

// #if [DEV]
const zh_dupKeys = findDuplicateKeys([
  commonZhCN.translation,
  zhCN.translation,
  sqleZhCN.translation
]);
if (zh_dupKeys.length > 0) {
  throw new Error(
    `DMS ZhCN_Locale error: The same key exists: ${zh_dupKeys.toString()}`
  );
}

const en_dupKeys = findDuplicateKeys([
  commonEnUS.translation,
  enUS.translation,
  sqleEnUS.translation
]);
if (en_dupKeys.length > 0) {
  throw new Error(
    `DMS EnUS_Locale error: The same key exists: ${en_dupKeys.toString()}`
  );
}
// #endif

const allZhCN = {
  translation: {
    ...sqleZhCN.translation,
    ...commonZhCN.translation,
    ...zhCN.translation
  }
};

const allEnUS = {
  translation: {
    ...commonEnUS.translation,
    ...sqleEnUS.translation,
    ...enUS.translation
  }
};

export type I18nKey = TemplateKeyPath<typeof allZhCN.translation>;

const initReactI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      [SupportLanguage.zhCN]: allZhCN,
      [SupportLanguage.enUS]: allEnUS
    },
    // #if [DEV]
    debug: true,
    // #endif
    lng: LocalStorageWrapper.getOrDefault(
      StorageKey.Language,
      DEFAULT_LANGUAGE
    ),
    fallbackLng: SupportLanguage.zhCN,
    interpolation: {
      escapeValue: false,
      skipOnVariables: false
    }
  });
};

const t = (key: I18nKey, opts: TOptions = {}) => {
  return i18n.t(key, opts);
};

export { t, initReactI18n };

export default i18n;
