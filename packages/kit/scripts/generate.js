const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始生成 API 和模板导入文件...');

// 创建必要的目录
const apiDir = path.join(__dirname, '../src/api');
const dataDir = path.join(__dirname, '../src/data');
const enumDir = path.join(__dirname, '../src/enum');
const componentsDir = path.join(__dirname, '../src/components');
const hooksDir = path.join(__dirname, '../src/hooks');
const providersDir = path.join(__dirname, '../src/providers');

// 确保目录存在
if (!fs.existsSync(path.join(__dirname, '../src'))) {
  fs.mkdirSync(path.join(__dirname, '../src'), { recursive: true });
}

const dirs = [apiDir, dataDir, enumDir, componentsDir, hooksDir, providersDir];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. 生成 API 客户端 (保持不变)
console.log('生成 API 客户端...');
try {
  const sqleApiOutput = path.resolve(apiDir, 'sqle', 'service');
  const dmsApiOutput = path.resolve(apiDir, 'dms', 'service');
  execSync(
    `pnpm api_client:g -p sqle-ui --output ${sqleApiOutput} && pnpm api_client:g -p dms-ui --output ${dmsApiOutput}`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../../..')
    }
  );
  console.log('API 客户端生成完成');
} catch (error) {
  console.warn('API 客户端生成失败，但继续进行下一步:', error.message);
}

// 2. 从 shared/lib 复制代码到 kit/src
console.log('复制 shared/lib 代码到 kit/src...');

const sharedLibDir = path.join(__dirname, '../../shared/lib');
const kitSrcDir = path.join(__dirname, '../src');

function copyDir(src, dest, options = {}) {
  const { filter, overwrite = false } = options;
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (filter && !filter(srcPath, entry)) continue;
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, { filter, overwrite });
    } else if (entry.isFile()) {
      if (!overwrite && fs.existsSync(destPath)) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 需要复制的目录列表（排除 api、testUtil、features）
const dirsToCopy = [
  'components',
  'hooks',
  'enum',
  'theme',
  'types',
  'styleWrapper',
  'locale',
  'data',
  'utils'
];

const shouldInclude = (srcPath, entry) => {
  // 排除测试文件与快照
  if (entry.isDirectory() && entry.name === '__snapshots__') return false;
  if (entry.isFile() && /\.test\.[tj]sx?$/.test(entry.name)) return false;
  // 排除文档与映射文件
  if (entry.isFile() && /\.md$/.test(entry.name)) return false;
  if (entry.isFile() && /\.map$/.test(entry.name)) return false;
  return true;
};

try {
  // 主动移除已废弃目录（features）
  const removeDirIfExists = (dirPath) => {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`已移除目录: ${path.relative(kitSrcDir, dirPath)}`);
    }
  };
  removeDirIfExists(path.join(kitSrcDir, 'features'));

  dirsToCopy.forEach((dirName) => {
    const srcPath = path.join(sharedLibDir, dirName);
    const destPath = path.join(kitSrcDir, dirName);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath, { filter: shouldInclude, overwrite: false });
      console.log(`已复制: ${dirName}`);
    } else {
      console.warn(`跳过不存在的目录: ${dirName}`);
    }
  });

  // 单独为 data 目录写一个 index.ts 入口（shared/lib/data 没有 index.ts）
  const dataIndexContent = `// Data exports (local copy)
export * from './EmitterKey';
export * from './common';
export * from './routePaths';
`;
  const dataIndexPath = path.join(dataDir, 'index.ts');
  if (!fs.existsSync(dataIndexPath)) {
    fs.writeFileSync(dataIndexPath, dataIndexContent);
    console.log('已创建 data/index.ts');
  } else {
    console.log('跳过 data/index.ts（已存在）');
  }

  // 重写 types/common.type.ts，移除与 PermissionsConstantType 相关的类型
  const commonTypePath = path.join(kitSrcDir, 'types', 'common.type.ts');
  if (fs.existsSync(commonTypePath)) {
    let content = fs.readFileSync(commonTypePath, 'utf8');
    const original = content;

    // 移除导入 PermissionsConstantType 的语句
    content = content.replace(
      /^import\s*\{\s*PermissionsConstantType\s*\}\s*from\s*['"][^'"]+['"];?\s*\n/m,
      ''
    );

    // 移除对象类型中的 permission?: PermissionsConstantType;
    content = content.replace(/^\s*permission\?\s*:\s*[^;]+;\s*\n/m, '');

    if (content !== original) {
      fs.writeFileSync(commonTypePath, content);
      console.log(
        '已重写 types/common.type.ts（移除 PermissionsConstantType 相关声明）'
      );
    } else {
      console.log(
        'types/common.type.ts 未检测到需要移除的 PermissionsConstantType 声明'
      );
    }
  }

  console.log('shared/lib 代码复制完成');
} catch (error) {
  console.error('复制 shared/lib 代码失败:', error.message);
}

// 3. 生成 Providers（theme.tsx / locale.tsx / index.tsx）
console.log('生成 Providers...');
try {
  // theme.tsx
  const themeProviderContent = `import {
  StyledEngineProvider,
  ThemeProvider as MuiThemeProvider
} from '@mui/system';
import { ReactNode } from 'react';
import { SupportTheme } from '../enum';
import darkTheme from '../theme/dark';
import lightTheme from '../theme/light';

import '../types/theme.type';

const themeData = {
  [SupportTheme.DARK]: darkTheme,
  [SupportTheme.LIGHT]: lightTheme
};

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: typeof themeData;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = themeData
}) => {
  return (
    <StyledEngineProvider>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export { themeData as defaultTheme };
`;
  fs.writeFileSync(path.join(providersDir, 'theme.tsx'), themeProviderContent);
  console.log('已创建 providers/theme.tsx');

  // locale.tsx
  const localeProviderContent = `import React, { ReactNode, useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { createInstance, i18n as I18nInstance, Resource } from 'i18next';

import { SupportLanguage } from '../enum';
import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';
import { DEFAULT_LANGUAGE } from '../locale';

type PlainObject = Record<string, any>;

function isObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge<T extends PlainObject, U extends PlainObject>(
  target: T,
  source: U
): T & U {
  const output: PlainObject = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = (source as PlainObject)[key];
    const targetValue = (output as PlainObject)[key];
    if (isObject(sourceValue) && isObject(targetValue)) {
      (output as PlainObject)[key] = deepMerge(targetValue, sourceValue);
    } else {
      (output as PlainObject)[key] = sourceValue;
    }
  });
  return output as T & U;
}

export const defaultLocaleResources: Resource = {
  [SupportLanguage.zhCN]: zhCN,
  [SupportLanguage.enUS]: enUS
};

export type CreateKitI18nOptions = {
  language?: string;
  resources?: Resource;
  fallbackLng?: string;
  instance?: I18nInstance;
};

export function createKitI18n(
  options: CreateKitI18nOptions = {}
): I18nInstance {
  const {
    language = DEFAULT_LANGUAGE,
    resources = {},
    fallbackLng = SupportLanguage.zhCN,
    instance
  } = options;

  const i18n = instance ?? createInstance();

  // If instance is already initialized by host app, just inject resources
  if ((i18n as any).isInitialized) {
    const merged: Resource = deepMerge(
      deepMerge({}, defaultLocaleResources),
      resources
    );
    // Inject resources into the existing instance
    Object.keys(merged).forEach((lng) => {
      const res = merged[lng as keyof Resource] as any;
      Object.keys(res).forEach((ns) => {
        i18n.addResourceBundle(lng, ns, res[ns], true, true);
      });
    });
    if (language) {
      i18n.changeLanguage(language);
    }
    return i18n;
  }

  const mergedResources: Resource = deepMerge(
    deepMerge({}, defaultLocaleResources),
    resources
  );

  i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng,
    resources: mergedResources,
    interpolation: { escapeValue: false },
    defaultNS: 'translation'
  });

  return i18n;
}

export interface LocaleProviderProps {
  children: ReactNode;
  i18n?: I18nInstance;
  language?: string;
  resources?: Resource;
  fallbackLng?: string;
  injectDefaultResources?: boolean;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  i18n,
  language = DEFAULT_LANGUAGE,
  resources = {},
  fallbackLng = SupportLanguage.zhCN,
  injectDefaultResources = true
}) => {
  const i18nInstance = useMemo(() => {
    if (i18n) {
      const toUse = i18n;
      if (injectDefaultResources) {
        const merged: Resource = deepMerge(
          deepMerge({}, defaultLocaleResources),
          resources
        );
        Object.keys(merged).forEach((lng) => {
          const res = merged[lng as keyof Resource] as any;
          Object.keys(res).forEach((ns) => {
            toUse.addResourceBundle(lng, ns, res[ns], true, true);
          });
        });
      } else if (Object.keys(resources).length > 0) {
        Object.keys(resources).forEach((lng) => {
          const res = (resources as any)[lng];
          Object.keys(res).forEach((ns) => {
            toUse.addResourceBundle(lng, ns, res[ns], true, true);
          });
        });
      }
      if (language) {
        toUse.changeLanguage(language);
      }
      return toUse;
    }

    return createKitI18n({ language, resources, fallbackLng });
  }, [i18n, language, resources, fallbackLng, injectDefaultResources]);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};
`;
  fs.writeFileSync(
    path.join(providersDir, 'locale.tsx'),
    localeProviderContent
  );
  console.log('已创建 providers/locale.tsx');

  // index.tsx (barrel exports)
  const providersIndexContent = `export * from './locale';
export * from './theme';
`;
  fs.writeFileSync(path.join(providersDir, 'index.tsx'), providersIndexContent);
  console.log('已创建 providers/index.tsx');
} catch (error) {
  console.error('生成 Providers 失败:', error.message);
}

// 4. 修复 .d.ts 文件问题 (保持不变，只处理API部分)
console.log('修复 .d.ts 文件...');
try {
  // 递归查找所有 .d.ts 文件的函数
  function findDtsFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findDtsFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  // 递归查找所有 .ts 文件的函数
  function findTsFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findTsFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  // 查找所有的 .d.ts 文件
  const dtsFiles = findDtsFiles(apiDir);

  console.log(`找到 ${dtsFiles.length} 个 .d.ts 文件`);

  dtsFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    const newPath = fullPath.replace(/\.d\.ts$/, '.type.ts');

    console.log(`重命名: ${file} -> ${file.replace(/\.d\.ts$/, '.type.ts')}`);
    fs.renameSync(fullPath, newPath);
  });

  // 查找所有的 .ts 文件并修复导入语句
  const tsFiles = findTsFiles(apiDir);

  tsFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 替换导入语句中的 .d 引用
    const originalContent = content;
    content = content.replace(
      /from\s+['"`]([^'"`]*?)\.d['"`]/g,
      "from '$1.type'"
    );

    if (content !== originalContent) {
      console.log(`修复导入语句: ${file}`);
      fs.writeFileSync(fullPath, content);
    }
  });

  console.log('.d.ts 文件修复完成');
} catch (error) {
  console.error('修复 .d.ts 文件失败:', error.message);
}

// 5. 为生成的 API 类型文件添加 @ts-nocheck 忽略类型检查 (保持不变)
console.log('为 API 类型文件添加 @ts-nocheck...');
try {
  // 查找所有的 .type.ts 文件
  function findTypeFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        findTypeFiles(fullPath, files);
      } else if (entry.isFile() && entry.name.endsWith('.type.ts')) {
        files.push(path.relative(apiDir, fullPath));
      }
    }

    return files;
  }

  const typeFiles = findTypeFiles(apiDir);

  console.log(`找到 ${typeFiles.length} 个 .type.ts 文件`);

  typeFiles.forEach((file) => {
    const fullPath = path.join(apiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // 检查是否已经有 @ts-nocheck 注释
    if (!content.includes('// @ts-nocheck')) {
      // 在文件顶部添加 @ts-nocheck 注释
      content = '/* eslint-disable */\n // @ts-nocheck\n' + content;
      fs.writeFileSync(fullPath, content);
      console.log(`添加 @ts-nocheck: ${file}`);
    }
  });

  console.log('API 类型文件 @ts-nocheck 添加完成');
} catch (error) {
  console.error('添加 @ts-nocheck 失败:', error.message);
}

// 6. 生成 API 入口文件 (保持不变)
console.log('生成 API 入口文件...');
try {
  // 为 API 客户端创建必要的工具目录
  const commonUtilsDir = path.join(apiDir, 'utils');
  const sqleUtilsDir = path.join(apiDir, 'sqle', 'utils');
  const dmsUtilsDir = path.join(apiDir, 'dms', 'utils');

  if (!fs.existsSync(commonUtilsDir)) {
    fs.mkdirSync(commonUtilsDir, { recursive: true });
  }

  if (!fs.existsSync(sqleUtilsDir)) {
    fs.mkdirSync(sqleUtilsDir, { recursive: true });
  }

  if (!fs.existsSync(dmsUtilsDir)) {
    fs.mkdirSync(dmsUtilsDir, { recursive: true });
  }

  // 通用 API Client 内容
  const apiClientContent = `import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

export type ApiClientConfigOptions = {
  /** 自定义错误处理函数 */
  onError?: (error: any) => void;
  /** 是否在控制台输出调试信息 */
  debug?: boolean;
  /** 自定义请求拦截器 */
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  /** 自定义响应拦截器 */
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse;
};

class SDKApiClient {
  private client: AxiosInstance | null = null;
  private options: ApiClientConfigOptions = {};

  /**
   * 配置 API 客户端实例
   * @param apiClient - axios 实例或兼容的 HTTP 客户端
   * @param options - 配置选项  
   */
  configure(apiClient: AxiosInstance, options: ApiClientConfigOptions = {}): void {
    this.client = apiClient;
    this.options = { ...this.options, ...options };
    
    if (this.options.debug) {
      console.log('[SDK API Client] Configured successfully');
    }
  }

  /**
   * 更新配置选项
   * @param options - 新的配置选项
   */
  updateOptions(options: Partial<ApiClientConfigOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * 获取当前配置的 API 客户端
   */
  getInstance(): AxiosInstance {
    if (!this.client) {
      const error = new Error(
        'API client not configured. Please call configure() with your axios instance first.\\n' +
        'Example: ApiClient.configure(axios.create({ baseURL: "your-api-url" }))'
      );
      
      if (this.options.onError) {
        this.options.onError(error);
      }
      
      throw error;
    }
    return this.client;
  }

  /**
   * 重置 API 客户端配置
   */
  reset(): void {
    this.client = null;
    this.options = {};
    
    if (this.options.debug) {
      console.log('[SDK API Client] Reset successfully');
    }
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * 直接设置 API 客户端实例（高级用法）
   * @param client - API 客户端实例
   */
  setClient(client: AxiosInstance): void {
    this.client = client;
  }

  // 代理方法，直接调用配置的客户端
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] GET:', url, finalConfig);
      }
      
      const response = await this.getInstance().get<T>(url, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] POST:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().post<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] PUT:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().put<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] PATCH:', url, data, finalConfig);
      }
      
      const response = await this.getInstance().patch<T>(url, data, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const finalConfig = this.options.requestInterceptor 
        ? this.options.requestInterceptor(config || {})
        : config;
        
      if (this.options.debug) {
        console.log('[SDK API Client] DELETE:', url, finalConfig);
      }
      
      const response = await this.getInstance().delete<T>(url, finalConfig);
      
      return this.options.responseInterceptor 
        ? this.options.responseInterceptor(response)
        : response;
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(error);
      }
      throw error;
    }
  }
}

// 导出单例实例
const apiClient = new SDKApiClient();
export default apiClient;

// 导出类型和类，允许用户创建自己的实例
export { SDKApiClient };
`;

  // 写入公共的 ApiClient.ts 文件
  fs.writeFileSync(path.join(commonUtilsDir, 'ApiClient.ts'), apiClientContent);

  // 在 sqle/utils 下创建引用文件
  const sqleApiReference = `// Re-export from common utils
export * from '../../utils/ApiClient';
export { default } from '../../utils/ApiClient';
`;
  fs.writeFileSync(path.join(sqleUtilsDir, 'Api.ts'), sqleApiReference);

  // 在 dms/utils 下创建引用文件
  const dmsApiReference = `// Re-export from common utils
export * from '../../utils/ApiClient';
export { default } from '../../utils/ApiClient';
`;
  fs.writeFileSync(path.join(dmsUtilsDir, 'Api.ts'), dmsApiReference);

  const apiIndexContent = `// SQLE API exports
export * as SQLEService from './sqle';

// DMS API exports  
export * as DMSService from './dms';

// API Client exports (common)
export { default as ApiClient } from './utils/ApiClient';
export { SDKApiClient } from './utils/ApiClient';

// Types
export type { 
  ApiClientConfigOptions 
} from './utils/ApiClient';
`;

  fs.writeFileSync(path.join(apiDir, 'index.ts'), apiIndexContent);
  console.log('API 入口文件生成完成');
} catch (error) {
  console.error('生成 API 入口文件失败:', error.message);
}

// 7. 生成主入口文件
console.log('生成主入口文件...');
try {
  const indexContent = `// API exports
export * from './api';

// Data exports
export * from './data';

// Enum exports
export * from './enum';

// Components exports
export * from './components';

// Providers exports
export * from './providers';

// Locale exports (types, constants)
export * from './locale';

// Hooks exports
export * from './hooks';
`;

  fs.writeFileSync(path.join(__dirname, '../src/index.ts'), indexContent);
  console.log('主入口文件生成完成');
} catch (error) {
  console.error('生成主入口文件失败:', error.message);
}

console.log('所有文件生成完成！');
