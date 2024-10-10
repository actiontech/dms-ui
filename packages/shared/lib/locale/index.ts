import { SupportLanguage } from '../enum';
import { TemplateKeyPath } from '../types/common.type';
import commonZhCN from './zh-CN';

const getPreferredLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return Array.from(navigator.languages);
  }
  return [navigator.language];
};

export const DEFAULT_LANGUAGE = getPreferredLanguage()[0].startsWith('en')
  ? SupportLanguage.enUS
  : SupportLanguage.zhCN;

export type I18nKey = TemplateKeyPath<typeof commonZhCN.translation>;
