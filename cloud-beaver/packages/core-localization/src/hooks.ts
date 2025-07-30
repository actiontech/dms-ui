import { useContext } from 'react';
import { LocalizationContext } from './context';
import type { LocalizationContextType } from './types';

/**
 * 使用翻译功能的 hook
 * 类似于 react-i18next 的 useTranslation
 * @returns 包含当前语言、切换语言函数和翻译函数的对象
 */
export function useTranslation(): LocalizationContextType {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      'useTranslation must be used within a LocalizationProvider. ' +
        'Make sure to wrap your component tree with <LocalizationProvider>.'
    );
  }

  return context;
}

/**
 * 获取当前语言的 hook
 * @returns 当前语言代码
 */
export function useCurrentLanguage() {
  const { currentLanguage } = useTranslation();
  return currentLanguage;
}

/**
 * 获取语言切换函数的 hook
 * @returns 语言切换函数
 */
export function useChangeLanguage() {
  const { changeLanguage } = useTranslation();
  return changeLanguage;
}

/**
 * 获取翻译函数的 hook
 * @returns t 函数（翻译函数）
 */
export function useT() {
  const { t } = useTranslation();
  return t;
}
