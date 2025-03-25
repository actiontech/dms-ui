import { SupportLanguage } from '../enum';
import { TemplateKeyPath } from '../types/common.type';
import commonZhCN from './zh-CN';

const BrowserLanguagePrefixReflect = {
  en: SupportLanguage.enUS,
  zh: SupportLanguage.zhCN,
  ko: SupportLanguage.koKR
};

const getPreferredLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return Array.from(navigator.languages);
  }
  return [navigator.language];
};

export const DEFAULT_LANGUAGE =
  BrowserLanguagePrefixReflect[
    getPreferredLanguage()[0].split(
      '-'
    )[0] as keyof typeof BrowserLanguagePrefixReflect
  ] ?? SupportLanguage.zhCN;

export type I18nKey = TemplateKeyPath<typeof commonZhCN.translation>;
