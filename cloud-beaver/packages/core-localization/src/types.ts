// 语言包条目类型：[key, value] 格式
// 语言包类型：语言包条目的数组
export type LocaleResource = string[][];

// 支持的语言代码
export type SupportedLanguage = 'zh' | 'en' | 'fr' | 'it' | 'ru' | 'vi';

// 语言包映射：语言代码到语言包资源的映射
export type LocaleResources = Record<SupportedLanguage, LocaleResource>;

// 翻译函数的参数类型
export interface TranslationParams {
  [key: string]: string | number;
}

// 翻译函数类型
export type TranslateFunction = (
  key: string,
  params?: TranslationParams
) => string;

// 国际化上下文类型
export interface LocalizationContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  t: TranslateFunction;
  translate: TranslateFunction;
}

// Provider 组件的 props 类型
export interface LocalizationProviderProps {
  children: React.ReactNode;
  resources: LocaleResources;
  defaultLanguage?: SupportedLanguage;
}
