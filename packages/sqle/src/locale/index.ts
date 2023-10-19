import { LocalStorageWrapper } from '@actiontech/shared';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { Dictionary } from '../types/common.type';
import enUS from './en-US';
import zhCN from './zh-CN';
import commonEnUS from '@actiontech/shared/lib/locale/en-US';
import commonZhCN from '@actiontech/shared/lib/locale/zh-CN';
import { TemplateKeyPath } from '@actiontech/shared/lib/types/common.type';

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
      SupportLanguage.zhCN
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
