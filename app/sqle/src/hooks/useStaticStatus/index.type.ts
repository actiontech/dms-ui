import { I18nKey } from '../../locale';

export type StaticEnumDictionary<T extends string> = {
  [key in T]: I18nKey;
};
