import type {
  LocaleResource,
  LocaleResources,
  TranslationParams
} from './types';

/**
 * 将语言包数组转换为键值对映射
 * @param resource 语言包数组 [[key, value], ...]
 * @returns 键值对映射 { key: value, ... }
 */
export function transformLocaleResource(
  resource: LocaleResource
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, value] of resource) {
    map[key] = value;
  }
  return map;
}

/**
 * 翻译函数实现
 * @param key 翻译键
 * @param localeMap 语言包映射
 * @param params 参数对象，用于字符串插值
 * @returns 翻译后的字符串
 */
export function translateWithParams(
  key: string,
  localeMap: Record<string, string>,
  params?: TranslationParams
): string {
  let text = localeMap[key] || key;

  // 如果有参数，进行字符串插值
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      // 支持 {{key}} 和 {key} 两种格式
      const regex1 = new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g');
      const regex2 = new RegExp(`\\{${paramKey}\\}`, 'g');
      text = text.replace(regex1, String(value)).replace(regex2, String(value));
    });
  }

  return text;
}

/**
 * 安全获取本地存储的语言设置
 * @param defaultLanguage 默认语言
 * @returns 语言代码
 */
export function getStoredLanguage(defaultLanguage: string): string {
  try {
    return typeof window !== 'undefined'
      ? localStorage.getItem('language') || defaultLanguage
      : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

/**
 * 安全设置本地存储的语言设置
 * @param language 语言代码
 */
export function setStoredLanguage(language: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  } catch {
    // 忽略存储错误
  }
}

/**
 * 合并多个语言包资源
 * @param resourcesArray 语言包资源数组，后面的会覆盖前面的相同 key
 * @returns 合并后的语言包资源
 */
export function mergeLocaleResources(
  ...resourcesArray: Record<string, LocaleResource>[]
): LocaleResources {
  const result: Record<string, LocaleResource> = {};

  // 获取所有支持的语言
  const allLanguages = new Set<string>();
  resourcesArray.forEach((resources) => {
    Object.keys(resources).forEach((lang) => allLanguages.add(lang));
  });

  // 为每种语言合并语言包
  allLanguages.forEach((language) => {
    const mergedLocaleResource: LocaleResource = [];
    const keyValueMap = new Map<string, string>();
    const duplicateWarnings: string[] = [];

    // 按顺序合并，后面的覆盖前面的
    resourcesArray.forEach((resources) => {
      if (resources[language]) {
        resources[language].forEach(([key, value]) => {
          // 检查是否存在重复的 key
          if (keyValueMap.has(key)) {
            const previousValue = keyValueMap.get(key);
            if (previousValue !== value) {
              duplicateWarnings.push(
                `Key "${key}": "${previousValue}" -> "${value}"`
              );
            }
          }
          keyValueMap.set(key, value);
        });
      }
    });

    // 输出重复 key 的警告信息
    if (duplicateWarnings.length > 0) {
      console.warn(
        `🌍 LocalizationProvider: Found ${duplicateWarnings.length} duplicate key(s) in language "${language}":\n` +
          duplicateWarnings.map((warning) => `  - ${warning}`).join('\n')
      );
    }

    // 转换回数组格式
    keyValueMap.forEach((value, key) => {
      mergedLocaleResource.push([key, value]);
    });

    result[language] = mergedLocaleResource;
  });

  return result as LocaleResources;
}
