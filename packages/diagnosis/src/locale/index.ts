import { StorageKey, SupportLanguage } from '@actiontech/shared/lib/enum';
import i18n, { TOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LocalStorageWrapper } from '@actiontech/shared';
import zhCN from './zh-CN';
import commonZhCN from '@actiontech/shared/lib/locale/zh-CN';
import { TemplateKeyPath } from '@actiontech/shared/lib/types/common.type';

const allZhCN = {
  translation: { ...commonZhCN.translation, ...zhCN.translation }
};

export const initReactI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      [SupportLanguage.zhCN]: allZhCN
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

export type I18nKey = TemplateKeyPath<typeof allZhCN.translation>;

const t = (key: I18nKey, opts: TOptions = {}) => {
  return i18n.t(key, opts);
};
export { t };
export default i18n;
