import { StorageKey, SupportLanguage } from '@actiontech/shared/lib/enum';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import sqleZhCN from 'sqle/src/locale/zh-CN';
import sqleEnUS from 'sqle/src/locale/en-US';
import commonZhCN from '@actiontech/shared/lib/locale/zh-CN';
import commonEnUS from '@actiontech/shared/lib/locale/en-US';
import zhCN from './zh-CN';
import enUS from './en-US';
import { TOptions } from 'i18next';
import { LocalStorageWrapper } from '@actiontech/shared';
import { TemplateKeyPath } from '@actiontech/shared/lib/types/common.type';
import { findDuplicateKeys } from '../utils/findDuplicateKeys';

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
    lng: LocalStorageWrapper.getOrDefault(
      StorageKey.Language,
      SupportLanguage.zhCN
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
