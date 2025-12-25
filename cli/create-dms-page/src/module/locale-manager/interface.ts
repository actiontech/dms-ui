import { IModuleBase } from '../interface';

export interface ILocaleConfig {
  localeDirAtPath: string;
  localeIndexFileAtPath: string;
  localeModuleName: string;
  localeModuleFileAtPath: string;
  menuI18nKeyPath: string;
  menuI18nFileAtPath: string;
}
export interface ILocaleManager extends IModuleBase<ILocaleConfig> {}
