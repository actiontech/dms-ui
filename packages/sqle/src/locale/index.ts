import { LocalStorageWrapper } from '@actiontech/shared';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { StorageKey } from '@actiontech/shared/lib/enum';
import enUS from './en-US';
import zhCN from './zh-CN';
import commonEnUS from '@actiontech/shared/lib/locale/en-US';
import commonZhCN from '@actiontech/shared/lib/locale/zh-CN';
import {
  Dictionary,
  TemplateKeyPath
} from '@actiontech/shared/lib/types/common.type';
import { findDuplicateKeys } from '../../../base/src/utils/findDuplicateKeys';
import { DEFAULT_LANGUAGE } from '@actiontech/shared/lib/locale';

// #if [DEV]
const zh_dupKeys = findDuplicateKeys([
  commonZhCN.translation,
  zhCN.translation
]);
if (zh_dupKeys.length > 0) {
  throw new Error(
    `SQLE ZhCN_Locale error: The same key exists: ${zh_dupKeys.toString()}`
  );
}

const en_dupKeys = findDuplicateKeys([
  commonEnUS.translation,
  enUS.translation
]);
if (en_dupKeys.length > 0) {
  throw new Error(
    `SQLE EnUS_Locale error: The same key exists: ${en_dupKeys.toString()}`
  );
}
// #endif

const allZhCN = {
  translation: { ...commonZhCN.translation, ...zhCN.translation }
};

const allEnUS = {
  translation: { ...commonEnUS.translation, ...enUS.translation }
};

export type I18nKey = TemplateKeyPath<typeof allZhCN.translation>;

export const initReactI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      [SupportLanguage.zhCN]: allZhCN,
      [SupportLanguage.enUS]: allEnUS
    },
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

const t = (key: I18nKey, dic?: Dictionary) => {
  return i18n.t(key, dic);
};

export { t };
export default i18n;
