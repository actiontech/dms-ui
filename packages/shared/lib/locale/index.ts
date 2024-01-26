import { TemplateKeyPath } from '../types/common.type';
import commonZhCN from './zh-CN';
import { TOptions } from 'i18next';
import i18n from 'i18next';

export type I18nKey = TemplateKeyPath<typeof commonZhCN.translation>;

export const t = (key: I18nKey, opts: TOptions = {}) => {
  return i18n.t(key, opts);
};
