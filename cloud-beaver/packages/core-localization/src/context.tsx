import React, { createContext, useCallback, useState, useMemo } from 'react';
import type {
  LocalizationContextType,
  LocalizationProviderProps,
  SupportedLanguage,
  TranslationParams
} from './types';
import {
  transformLocaleResource,
  translateWithParams,
  getStoredLanguage,
  setStoredLanguage
} from './utils';

// 创建国际化上下文
export const LocalizationContext =
  createContext<LocalizationContextType | null>(null);

/**
 * 国际化 Provider 组件
 * 提供语言切换和翻译功能
 */
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
  resources,
  defaultLanguage = 'zh'
}) => {
  // 从本地存储获取初始语言，如果不存在则使用默认语言
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    () => {
      const stored = getStoredLanguage(defaultLanguage);
      return (
        Object.keys(resources).includes(stored) ? stored : defaultLanguage
      ) as SupportedLanguage;
    }
  );

  // 当前语言的语言包映射
  const currentLocaleMap = useMemo(() => {
    const resource = resources[currentLanguage] || [];
    return transformLocaleResource(resource);
  }, [resources, currentLanguage]);

  // 切换语言函数
  const changeLanguage = useCallback(
    (language: SupportedLanguage) => {
      if (resources[language]) {
        setCurrentLanguage(language);
        setStoredLanguage(language);
      } else {
        console.warn(
          `Language "${language}" is not supported. Available languages:`,
          Object.keys(resources)
        );
      }
    },
    [resources]
  );

  // 翻译函数
  const translate = useCallback(
    (key: string, params?: TranslationParams): string => {
      return translateWithParams(key, currentLocaleMap, params);
    },
    [currentLocaleMap]
  );

  // t 函数（translate 的别名）
  const t = translate;

  // 构建上下文值
  const contextValue = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      t,
      translate
    }),
    [currentLanguage, changeLanguage, t, translate]
  );

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};
